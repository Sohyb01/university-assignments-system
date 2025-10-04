import { auth } from "@/auth";
import CourseNavMenuStudent from "@/components/custom/CourseNavMenuStudent";
import { db } from "@/db";
import { courses, map_courses_students } from "@/db/schema/courses";
import { and, eq } from "drizzle-orm";
import { ReactNode } from "react";

interface ClassLayoutProps {
  params: {
    courseId: string;
  };
  children: ReactNode;
}

const ClassLayout = async ({
  params: { courseId },
  children,
}: ClassLayoutProps) => {
  const session = await auth();

  const courseObj = await db
    .select()
    .from(courses)
    .innerJoin(
      map_courses_students,
      eq(courses.id, map_courses_students.id_course)
    )
    .where(
      and(
        eq(courses.id, courseId),
        eq(map_courses_students.id_student, session!.user!.id)
      )
    )
    .limit(1);
  if (courseObj[0] == undefined) {
    return (
      <div className="not-found">No course found with the specified ID</div>
    );
  }

  return (
    <section className="dashboard-tab-wrapper">
      <h2 className="text-h2">{courseObj[0].courses.name}</h2>
      <CourseNavMenuStudent courseObj={courseObj[0].courses} />
      {children}
    </section>
  );
};

export default ClassLayout;
