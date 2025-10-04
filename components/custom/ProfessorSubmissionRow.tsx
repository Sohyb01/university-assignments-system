"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { gradeSubmission } from "@/db/queries";
import { toast } from "sonner";
import Link from "next/link";

export type AssignmentSubmissionData = {
  studentId: string;
  firstName: string;
  lastName: string;
  submissionId: string | null;
  submission: string | null;
  status: "submitted" | "passed" | "failed" | null;
  submittedAt: Date | null;
  feedback: string | null;
};

export type ProfessorSubmissionRowProps = {
  submissionData: AssignmentSubmissionData;
  assignmentId: string;
};

const ProfessorSubmissionRow: React.FC<ProfessorSubmissionRowProps> = ({
  submissionData,
}) => {
  const router = useRouter();
  const [isGrading, setIsGrading] = useState(false);
  const [gradeStatus, setGradeStatus] = useState<
    "passed" | "failed" | "submitted" | ""
  >(submissionData.status ? submissionData.status : "");
  const [feedbackText, setFeedbackText] = useState(
    submissionData.feedback ? submissionData.feedback : ""
  );
  const [gradeError, setGradeError] = useState("");

  const handleGradeSubmit = async () => {
    if (!submissionData.submissionId) return;
    if (!gradeStatus) {
      setGradeError("Please select a grade (pass or fail).");
      return;
    }
    setIsGrading(true);
    setGradeError("");
    try {
      await gradeSubmission({
        submissionId: submissionData.submissionId,
        newStatus: gradeStatus as "passed" | "failed",
        feedback: feedbackText.trim(),
      });
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setGradeError(error.message || "Failed to grade submission.");
    } finally {
      toast.success("Graded successfully!");
      setIsGrading(false);
    }
  };

  return (
    <div className="border p-4 flex flex-col gap-y-4 items-start md:flex-row justify-between w-full rounded-md md:items-center text-detail">
      <div className="flex w-full justify-between items-center md:max-w-[450px]">
        <div>
          <p className="font-medium capitalize">
            {submissionData.firstName} {submissionData.lastName}
          </p>
          {submissionData.submittedAt ? (
            <p className="text-muted-foreground">
              Submitted:{" "}
              {format(
                new Date(submissionData.submittedAt),
                "MMMM dd, yyyy, hh:mm a"
              )}
            </p>
          ) : (
            <p className="text-destructive">Not submitted</p>
          )}
        </div>
        {submissionData.submission && (
          <div>
            <p className="text-success capitalize">{submissionData.status}</p>
            <p className="text-sm font-medium capitalize">
              {submissionData.feedback ? "Feedback provided" : "No feedback"}
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center">
        {submissionData.submission && (
          <Link
            href={submissionData.submission}
            rel="noopener noreferrer"
            className={`${buttonVariants({
              variant: "outline",
              size: "sm",
            })}`}
          >
            View Submission
          </Link>
        )}
        {submissionData.submission && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Grading & Feedback</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grade Submission</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-8 pt-4">
                <div className="flex flex-col gap-2">
                  <Label>Select Grade</Label>
                  <RadioGroup
                    value={gradeStatus}
                    onValueChange={(val) =>
                      setGradeStatus(val as "passed" | "failed")
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="passed" id="passed" />
                      <Label htmlFor="passed">Pass</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="failed" id="failed" />
                      <Label htmlFor="failed">Fail</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Enter feedback (optional)"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>
                {gradeError && (
                  <p className="text-destructive text-sm">{gradeError}</p>
                )}
              </div>
              <DialogFooter>
                <Button
                  size="sm"
                  onClick={handleGradeSubmit}
                  disabled={isGrading}
                >
                  {isGrading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Grading...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ProfessorSubmissionRow;
