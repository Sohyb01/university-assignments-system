import FormAddAssignment from "@/components/custom/FormAddAssignment";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { courses } from "@/db/schema/courses";
import { getProfessorsInCourse } from "@/db/queries";

export default async function NewAssignmentPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const availableCourse = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId));

  const availableProfessorsResponse = await getProfessorsInCourse(courseId);
  const availableProfessors = availableProfessorsResponse.success
    ? availableProfessorsResponse.data!
    : []; // or handle the error appropriately (e.g., redirect, display an error message, etc.)

  return (
    <div className="dashboard-tab-wrapper">
      <h3 className="text-h3">Add an assignment</h3>
      <FormAddAssignment
        availableProfessors={availableProfessors}
        availableCourses={availableCourse}
      />
    </div>
  );
}
