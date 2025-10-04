"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { courses } from "@/db/schema/courses";
import { Card } from "../ui/card";

const PESStudentClassCard = ({
  availableCoursesWithRelatedData,
}: {
  availableCoursesWithRelatedData: {
    courses: typeof courses.$inferSelect;
    // map_courses_students: typeof map_courses_students.$inferSelect | null
    // students: typeof students.$inferSelect | null
  };
}) => {
  const pathname = usePathname();
  return (
    <Link
      href={`/dashboard/${pathname.split("/").filter(Boolean)[1]}/courses/${
        availableCoursesWithRelatedData.courses.id
      }`}
    >
      <Card className="items-center border-primary/50 hover:border-primary p-4 md:min-w-[300px]">
        <div>{availableCoursesWithRelatedData.courses.name}</div>
      </Card>
    </Link>
  );
};

export default PESStudentClassCard;
