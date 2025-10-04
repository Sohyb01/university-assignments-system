import { auth } from "@/auth";
import AttachmentsBadge from "@/components/custom/AttachmentsBadge";
import SubmitForAssignmentButton from "@/components/custom/SubmitForAssignmentButton";
import URLBadge from "@/components/custom/URLBadge";
import { Separator } from "@/components/ui/separator";
import { getAssignmentWithSubmissionByStudent } from "@/db/queries";

const ViewAssignmentPage = async ({
  params,
}: {
  params: { assignmentId: string };
}) => {
  const session = await auth();

  const assignmentResponse = await getAssignmentWithSubmissionByStudent(
    session!.user.id,
    params.assignmentId
  );

  if (assignmentResponse.error || !assignmentResponse.data) {
    return (
      <div className="flex flex-col gap-4 w-full text-p_ui">
        <h2 className="not-found">Error retrieving assignment data.</h2>
      </div>
    );
  }

  const assignment = assignmentResponse.data[0];

  return (
    <div className="flex flex-col gap-4 w-full text-p_ui">
      <h2 className="text-h3 pb-2">{assignment.name} Assignment</h2>
      {assignment.description && (
        <div className="max-w-[640px] w-full">
          <h3 className="text-muted-foreground">Description</h3>
          <p>{assignment.description}</p>
        </div>
      )}
      {assignment.notes && (
        <div className="max-w-[640px] w-full">
          <h3 className="text-muted-foreground">Notes</h3>
          <p>{assignment.notes}</p>
        </div>
      )}
      <div className="flex gap-4 items-center">
        {assignment.attachment && (
          <AttachmentsBadge attachments={assignment.attachment} />
        )}
        {assignment.url && <URLBadge url={assignment.url} />}
      </div>
      <Separator className="max-w-[640px]" />
      <SubmitForAssignmentButton assignment={assignment} />
    </div>
  );
};

export default ViewAssignmentPage;
