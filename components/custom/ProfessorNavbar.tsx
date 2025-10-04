"use client";

// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignLeft, BookOpenIcon, Home } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserNav } from "./UserNav";
import { useState } from "react";

const ProfessorNavbar = () => {
  // Search functionality
  const [open, setOpen] = useState(false);

  // Get the current pathname
  const pathname = usePathname();

  // Split the pathname and get the last segment
  const lastSegment = pathname.split("/").filter(Boolean)[3];

  return (
    <nav className="nav">
      <div className="nav-internal">
        <div className="flex gap-4">
          <h2>Dashboard</h2>
          {/* Sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={`${buttonVariants({
                variant: "outline",
                size: "icon",
              })} lg:hidden`}
            >
              <AlignLeft size={16} className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent
              side={"left"}
              className="p-8 gap-8 flex flex-col items-start overflow-scroll lg:hidden"
            >
              <p className="text-lead">Professor Dashboard</p>
              {/* All Platform Tab Links */}
              <div className="sidebar-groups-container">
                {/* Platform Tab Title & Links */}
                <div className="sidebar-group">
                  <p>Platform</p>
                  {/* Links */}
                  <div className="sidebar-links-container">
                    <Link
                      onClick={() => setOpen(false)}
                      href="/dashboard/instructor/home"
                    >
                      <Button
                        className="sidebar-button rounded-full justify-start gap-2 px-3"
                        variant={lastSegment == "home" ? "default" : "outline"}
                      >
                        <Home size={16} /> Home
                      </Button>
                    </Link>
                    <Link
                      onClick={() => setOpen(false)}
                      href="/dashboard/instructor/courses"
                    >
                      <Button
                        className="sidebar-button rounded-full justify-start gap-2 px-3"
                        variant={
                          lastSegment == "courses" ? "default" : "outline"
                        }
                      >
                        <BookOpenIcon size={16} /> Courses
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex gap-4">
          {/* User button */}
          <UserNav />
        </div>
      </div>
    </nav>
  );
};

export default ProfessorNavbar;
