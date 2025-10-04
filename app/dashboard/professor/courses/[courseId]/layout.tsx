import CourseNavMenuProfessor from "@/components/custom/CourseNavMenuProfessor";
import { db } from "@/db";
import { courses } from "@/db/schema/courses";
import { eq } from "drizzle-orm";
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
  const courseObj = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (courseObj[0] == undefined) {
    return <div>No class found with the specified ID</div>;
  }

  return (
    <section className="dashboard-tab-wrapper">
      <div className="w-full flex justify-between items-center">
        <h2 className="hidden md:block text-h2">{courseObj[0].name}</h2>
        {/* <SyncChatMembersButton courseId={courseObj[0].id} /> */}
      </div>
      <CourseNavMenuProfessor courseObj={courseObj[0]} />
      {children}
    </section>
  );
};

export default ClassLayout;
