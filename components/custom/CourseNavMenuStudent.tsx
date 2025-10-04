"use client";
import { buttonVariants } from "@/components/ui/button";
import { courses } from "@/db/schema/courses";
import { cn } from "@/lib/utils";
import { NotepadText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ClassNavMenuStudent = ({
  courseObj,
  className,
}: {
  courseObj: typeof courses.$inferSelect;
  className?: string;
}) => {
  const CLASS_ITEMS = [
    // {
    //   title: "Overview",
    //   url: `/dashboard/student/courses/${courseObj.id}/overview`,
    //   icon: SquareChartGantt,
    // },
    // {
    //   title: "Exams",
    //   url: `/dashboard/student/courses/${courseObj.id}/exams`,
    //   icon: ClipboardPen,
    // },
    {
      title: "Assignments",
      url: `/dashboard/student/courses/${courseObj.id}/assignments`,
      icon: NotepadText,
    },
    // {
    //   title: "Materials",
    //   url: `/dashboard/student/courses/${courseObj.id}/materials`,
    //   icon: Book,
    // },
  ];

  const pathname = usePathname();

  return (
    <div
      className={cn("mb-4 border-b border-muted-foreground/60 py-2", className)}
    >
      <div className="flex gap-4 w-full items-start flex-wrap justify-start">
        {CLASS_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={`${item.url}`}
            className={cn(
              "font-medium",
              buttonVariants({
                variant: pathname.includes(item.url.split("/").pop()!)
                  ? "default"
                  : "ghost",
                size: "sm",
              }),
              pathname.includes(item.url.split("/").pop()!)
                ? "text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon size={16} />
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClassNavMenuStudent;
