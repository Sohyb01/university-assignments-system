"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const STUDENT_SIDE_BAR_ITEMS = [
  {
    title: "Home",
    url: "home",
    icon: "🏠",
  },
  // {
  //   title: "Schedule",
  //   url: "schedule",
  //   icon: "📅",
  // },
  {
    title: "Courses",
    url: "courses",
    icon: "📚",
  },
  // {
  //   title: "Achievements",
  //   url: "achievements",
  //   icon: "🏆",
  // },
  // {
  //   title: "Leaderboard",
  //   url: "leaderboard",
  //   icon: "🏅",
  // },
  // {
  //   title: "Invite & Earn",
  //   url: "invite-and-earn",
  //   icon: "💰",
  // },
  // {
  //   title: "Learn & Earn",
  //   url: "learn-and-earn",
  //   icon: "🪙",
  // },
];

const StudentSidebar = () => {
  // Get the current pathname
  const pathname = usePathname();
  // Split the pathname and get the last segment
  return (
    <nav className="hidden lg:flex rounded-[1rem] p-4 md:p-6 gap-8 flex-col items-start w-full max-w-[280px] h-full bg-background border">
      <h3 className="text-h3">Student Dashboard</h3>
      {/* All Platform Link Groups */}
      <div className="flex-1 justify-between sidebar-groups-container">
        {/* Platform Group Title & Links */}
        <div className="sidebar-group justify-between">
          {/* Links */}
          <div className="sidebar-links-container">
            {STUDENT_SIDE_BAR_ITEMS.map((item) => (
              <Link key={item.title} href={`/dashboard/student/${item.url}`}>
                <Button
                  className="sidebar-button rounded-full justify-start px-3"
                  variant={
                    pathname.includes(item.url.split("/").pop()!)
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                >
                  {item.icon} {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentSidebar;
