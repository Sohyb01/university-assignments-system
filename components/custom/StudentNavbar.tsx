"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserNav } from "./UserNav";
import { STUDENT_SIDE_BAR_ITEMS } from "./StudentSidebar";
import { useState } from "react";

export const StudentNavbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="nav">
      <div className="nav-internal">
        <div className="flex gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={`${buttonVariants({
                variant: "ghost",
                size: "icon",
              })} lg:hidden`}
            >
              <AlignLeft size={16} className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-4 md:p-6 pt-20 w-[280px] gap-8 flex flex-col items-start overflow-scroll lg:hidden student-sidebar-bg bg-background text-foreground"
            >
              <div className="flex-1 justify-between sidebar-groups-container">
                <div className="sidebar-group justify-between">
                  <div className="sidebar-links-container">
                    {STUDENT_SIDE_BAR_ITEMS.map((item) => (
                      <Link
                        key={item.url}
                        href={`/dashboard/student/${item.url}`}
                      >
                        <Button
                          className="sidebar-button rounded-full justify-start px-3"
                          variant={
                            pathname.includes(item.url) ? "default" : "ghost"
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
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-2">
          <UserNav />
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
