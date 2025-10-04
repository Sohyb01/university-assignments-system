"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpenIcon, Home } from "lucide-react";

const ProfessorSidebar = () => {
  // Get the current pathname
  const pathname = usePathname();
  // Split the pathname and get the last segment
  const lastSegment = pathname.split("/").filter(Boolean)[3];
  return (
    <nav className="hidden lg:flex p-8 gap-8 flex-col items-start w-full max-w-[280px] dashboard-sizing border-r border-border overflow-scroll">
      <h2 className="text-lead">Dashboard</h2>
      {/* All Platform Link Groups */}
      <div className="sidebar-groups-container">
        {/* Platform Group Title & Links */}
        <div className="sidebar-group">
          <p>Platform</p>
          {/* Links */}
          <div className="sidebar-links-container">
            <Link href="/dashboard/professor/home">
              <Button
                className="sidebar-button rounded-full justify-start gap-2 px-3"
                variant={lastSegment == "home" ? "default" : "outline"}
                size="sm"
              >
                <Home size={16} /> Home
              </Button>
            </Link>
            <Link href="/dashboard/professor/courses">
              <Button
                className="sidebar-button rounded-full justify-start gap-2 px-3"
                variant={lastSegment == "courses" ? "default" : "outline"}
                size="sm"
              >
                <BookOpenIcon size={16} /> Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProfessorSidebar;
