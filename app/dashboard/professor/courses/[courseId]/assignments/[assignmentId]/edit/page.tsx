import { auth } from "@/auth";
import FormAddAssignment from "@/components/custom/FormAddAssignment";
import { db } from "@/db";
import { assignments } from "@/db/schema/assignments";
import { courses } from "@/db/schema/courses";
import { professors } from "@/db/schema/users";
import { eq } from "drizzle-orm";

const EditAssignmentPage = async ({
  params,
}: {
  params: { assignmentId: string };
}) => {
  const session = await auth();

  const assignment = await db
    .select()
    .from(assignments)
    .where(eq(assignments.id, params.assignmentId))
    .then((res) => res[0]);
  const availableCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.id, assignment.id_course));

  const availableProfessors = await db
    .select()
    .from(professors)
    .where(eq(professors.id, session!.user!.id));

  return (
    <div className="dashboard-tab-wrapper">
      <h3 className="text-h3">Editing assignment</h3>
      <FormAddAssignment
        editObj={assignment}
        availableProfessors={availableProfessors}
        availableCourses={availableCourses}
      />
    </div>
  );
};

export default EditAssignmentPage;
