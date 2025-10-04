"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AssignmentWithSubmission,
  createAssignmentSubmission,
} from "@/db/queries";
import { uploadAssignmentAttachment } from "@/supabase/storage/client";
import { Loader2, UploadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, useRef, useState } from "react";

const SubmitForAssignmentButton = ({
  assignment,
}: {
  assignment: AssignmentWithSubmission;
}) => {
  const { data: session } = useSession();

  const [updatedAssignment, setUpdatedAssignment] = useState(assignment);

  const imageInputRef = useRef<HTMLInputElement>(null);
  //
  const [submitting, setSubmitting] = useState(false);

  // Handle multiple image uploads
  const handleSubmissionChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = Array.from(e.target.files)[0];
      try {
        setSubmitting(true);
        const attachmentUrl = await uploadAssignmentAttachment({
          file: data,
        });
        const res = await createAssignmentSubmission({
          id: undefined, // Cant have same ID as core assignment in assignment table
          id_assignment: assignment.id,
          submission: attachmentUrl.attachmentUrl,
          id_student: session!.user.id,
          status: undefined,
        });
        if (res.error) {
          toast.error("Error, " + res.message);
        } else {
          setUpdatedAssignment({
            ...assignment,
            id: res.id!,
            status: "submitted",
            submission: attachmentUrl.attachmentUrl,
          });
          toast.success("Submission added successfully!");
        }
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        toast.error((error as Error).message);
      }
    }
  };

  return (
    <div>
      <Input
        type="file"
        className="hidden"
        ref={imageInputRef}
        disabled={submitting}
        onChange={handleSubmissionChange}
      />
      <Button
        onClick={() => imageInputRef.current?.click()}
        variant={
          updatedAssignment.status == "submitted" ? "outline" : "default"
        }
        size="sm"
        disabled={submitting}
        className="flex gap-2 items-center"
      >
        {submitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <UploadIcon size={16} />
        )}
        {submitting
          ? "Submitting..."
          : updatedAssignment.status == "submitted"
          ? "Re-Submit"
          : updatedAssignment.status == "failed"
          ? "Failed"
          : "Submit"}
      </Button>
    </div>
  );
};

export default SubmitForAssignmentButton;
