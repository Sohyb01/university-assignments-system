"use client";

import React, { useRef, useState, ChangeEvent } from "react";
import { M_Card } from "@/components/custom/motion/Shadcn-Motion-Components";
import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  Eye,
  UploadIcon,
  Loader2,
  X,
  DownloadIcon,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TimeLeftBadge from "./TimeLeftBadge";
import { submitAssignment } from "@/supabase/storage/client";
import { DueAssignment, PastAssignment } from "@/db/queries";

export type AssignmentCardProps = {
  assignment: PastAssignment | DueAssignment;
};

const StudentAssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const now = new Date();

  // Determine if this assignment is past (i.e. has submission info) by checking if submissionId exists.
  const isPastAssignment = "submissionId" in assignment;

  // Local state for managing file uploads.
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // A ref to the hidden file input.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger the hidden file input.
  const handleFileInputClick = () => {
    setUploadError("");
    setUploadSuccess("");
    fileInputRef.current?.click();
  };

  // When a file is selected, upload it.
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user.id) return;
    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");
    try {
      // Call our server action.
      await submitAssignment({
        file,
        assignmentId: assignment.assignmentId,
        studentId: session.user.id,
        bucket: "assignment-submissions", // Use the specified bucket name.
        folder: "submissions", // Optional folder
      });
      setUploadSuccess("File uploaded successfully!");
      // Refresh the page so that the assignment moves from due to past.
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("File upload error:", error);
      setUploadError(error.message || "File upload failed.");
    } finally {
      setIsUploading(false);
      // Clear the file input so the same file can be uploaded again if needed.
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <M_Card
      // variants={VariantSlideInUp}
      // initial="initial"
      // animate="animate"
      className={`bg-background w-full rounded-[1rem] md:min-w-[300px] lg:min-w-[480px] max-w-[480px]`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap">
          <div className="text-p_ui w-full items-center flex justify-between">
            {assignment.assignmentName}
          </div>
          {isPastAssignment &&
            (assignment as PastAssignment).status === "submitted" && (
              <Badge variant="outline" className="flex items-center gap-2">
                <Eye size={16} />
                <span className="text-nowrap">Awaiting Review</span>
              </Badge>
            )}
          {isPastAssignment &&
            (assignment as PastAssignment).status === "passed" && (
              <Badge variant="success" className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Passed</span>
              </Badge>
            )}
          {isPastAssignment &&
            (assignment as PastAssignment).status === "failed" && (
              <Badge variant="destructive" className="flex items-center gap-2">
                <X size={16} />
                <span>Failed</span>
              </Badge>
            )}
        </CardTitle>
        <div>
          <p className="overflow-hidden text-muted-foreground text-subtle">
            {assignment.courseName} - {assignment.professorName}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-subtle">
        <p className="text-p line-clamp-5">
          {assignment.description || "No description"}
        </p>
        <div className="flex flex-wrap gap-2 gap-y-1">
          <Badge className="flex items-center gap-2">
            <Calendar size={16} />
            Due {format(assignment.dueDate, "MMMM dd, hh:mm a")}
          </Badge>
          {/* Show TimeLeftBadge only if the assignment is due */}
          {!isPastAssignment && assignment.dueDate > now && (
            <TimeLeftBadge endDate={assignment.dueDate} />
          )}
          {/* Show "Missed" badge if past and no submission */}
          {isPastAssignment &&
            (assignment as PastAssignment).status === null &&
            assignment.dueDate < now && (
              <Badge className="flex items-center gap-2 bg-destructive hover:bg-destructive w-fit">
                <X className="stroke-destructive-foreground" size={16} />
                <span>Missed</span>
              </Badge>
            )}
        </div>
        {isUploading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Uploading file...
          </p>
        )}
        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}
        {uploadSuccess && (
          <p className="text-sm text-success">{uploadSuccess}</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex gap-2 flex-wrap">
        {/* Hidden file input for submission */}
        <input
          type="file"
          accept="*/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        {isPastAssignment && (assignment as PastAssignment).submission && (
          <Link
            href={(assignment as PastAssignment).submission!}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full"
            )}
          >
            <DownloadIcon size={16} />
            <span>Download Submission</span>
          </Link>
        )}
        {/* For due assignments (no submission) and still due */}
        {(!isPastAssignment ||
          (!(assignment as PastAssignment).submission &&
            assignment.dueDate >= now)) &&
          session?.user.role === "student" && (
            <button
              onClick={handleFileInputClick}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "w-full"
              )}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting</span>
                </>
              ) : (
                <>
                  <UploadIcon size={16} />
                  <span>Submit</span>
                </>
              )}
            </button>
          )}
        {/* For past assignments with a "submitted" status allow re-submission */}
        {isPastAssignment &&
          (assignment as PastAssignment).status === "submitted" &&
          session?.user.role === "student" && (
            <button
              onClick={handleFileInputClick}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full"
              )}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting</span>
                </>
              ) : (
                <>
                  <UploadIcon size={16} />
                  <span>Re-submit</span>
                </>
              )}
            </button>
          )}
      </CardFooter>
    </M_Card>
  );
};

export default StudentAssignmentCard;
