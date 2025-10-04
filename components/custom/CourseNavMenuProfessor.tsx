"use client";
import { buttonVariants } from "@/components/ui/button";
import { courses } from "@/db/schema/courses";
import { cn } from "@/lib/utils";
import { NotepadText } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CourseNavMenuProfessor = ({
  courseObj,
  className,
}: {
  courseObj: typeof courses.$inferSelect;
  className?: string;
}) => {
  const { data: session } = useSession();

  const CLASS_ITEMS = [
    // {
    //   title: "Exams",
    //   url: `/dashboard/${session?.user.role}/courses/${courseObj.id}/exams`,
    //   icon: ClipboardPen,
    // },
    {
      title: "Assignments",
      url: `/dashboard/${session?.user.role}/courses/${courseObj.id}/assignments`,
      icon: NotepadText,
    },
    // {
    //   title: "Materials",
    //   url: `/dashboard/${session?.user.role}/courses/${courseObj.id}/materials`,
    //   icon: Book,
    // },
    // {
    //   title: "Members",
    //   url: `/dashboard/${session?.user.role}/courses/${courseObj.id}/members`,
    //   icon: Users,
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

export default CourseNavMenuProfessor;
