"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatMembersList from "./chat-members-list";
import { AvailableCourseWithRelatedData } from "@/db/queries";
import { Card } from "../ui/card";

const ProfessorClassCard = ({
  availableClassWithRelatedData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animateKey,
}: {
  availableClassWithRelatedData: AvailableCourseWithRelatedData;
  animateKey?: number;
}) => {
  const pathname = usePathname();
  return (
    <Link
      className="w-full md:min-w-[340px] lg:max-w-[400px]"
      href={`/dashboard/${pathname.split("/").filter(Boolean)[1]}/courses/${
        availableClassWithRelatedData.course_id
      }`}
    >
      <Card className="items-center border-primary/50 hover:border-primary p-4 w-full">
        <div>{availableClassWithRelatedData.course_name}</div>
        <ChatMembersList members={availableClassWithRelatedData.students} />
      </Card>
    </Link>
  );
};

export default ProfessorClassCard;
