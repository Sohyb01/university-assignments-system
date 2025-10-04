// src/app/instructor/assignments/[assignmentId]/submissions/page.tsx
import { auth } from "@/auth";
import ProfessorSubmissionRow, {
  AssignmentSubmissionData,
} from "@/components/custom/ProfessorSubmissionRow";
import { db } from "@/db";
import { getAssignmentSubmissions } from "@/db/queries";
import { assignments } from "@/db/schema/assignments";
import { eq } from "drizzle-orm";

export default async function AssignmentSubmissionsPage({
  params,
}: {
  params: { assignmentId: string };
}) {
  const session = await auth();
  if (!session || session.user.role !== "professor") {
    throw new Error("Unauthorized");
  }

  const assignmentId = params.assignmentId;

  const [assignmentObj] = await db
    .select()
    .from(assignments)
    .where(eq(assignments.id, assignmentId))
    .limit(1);

  const submissions: AssignmentSubmissionData[] =
    await getAssignmentSubmissions(assignmentId);

  return (
    <div className="px-4">
      {!assignmentObj ? (
        <div className="not-found">
          No assignment found with the specified ID.
        </div>
      ) : (
        <>
          <h2 className="text-h3 mb-4 capitalize">{assignmentObj.name}</h2>
          <h3 className="text-h4 mb-4">Student Submissions</h3>
          {submissions.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No submissions found.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {submissions.map((sub) => (
                <ProfessorSubmissionRow
                  key={sub.studentId}
                  submissionData={sub}
                  assignmentId={assignmentId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
