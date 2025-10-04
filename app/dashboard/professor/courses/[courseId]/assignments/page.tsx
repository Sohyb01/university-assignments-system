// src/app/instructor/assignments/page.tsx
import { auth } from "@/auth";
import ProfessorAssignmentCard from "@/components/custom/ProfessorAssignmentCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronUp, PlusIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getAssignmentsWithRelevantDataByCourse,
  ProfessorAssignment,
} from "@/db/queries";

const AssignmentsPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const session = await auth();
  // Make sure the session user has role instructor.
  const instructorId = session?.user.id;
  if (!instructorId) throw new Error("Unauthorized");

  const assignmentsData: ProfessorAssignment[] =
    await getAssignmentsWithRelevantDataByCourse(params.courseId);

  const now = new Date();
  const dueAssignments = assignmentsData.filter((a) => a.dueDate > now);
  const pastAssignments = assignmentsData.filter((a) => a.dueDate <= now);

  return (
    <div className="px-4 overflow-y-scroll flex flex-col gap-8">
      <div className="flex justify-between pb-2">
        <h3 className="text-h3">Assignments</h3>
        <Link
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          href="assignments/new"
        >
          <PlusIcon className="mr-2" />
          Create Assignment
        </Link>
      </div>
      {/* Due Assignments */}
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-p">
            Due Assignments{" "}
            <span className="font-normal text-muted-foreground">
              ({dueAssignments.length})
            </span>
          </h3>
          <CollapsibleTrigger asChild className="group">
            <Button size="icon">
              <ChevronUp
                className="group-data-[state=open]:rotate-180 transition-all"
                size={24}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {dueAssignments.length === 0 ? (
            <p className="text-muted-foreground text-center not-found">
              None found
            </p>
          ) : (
            <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-4">
              {dueAssignments.map((assignment) => (
                <ProfessorAssignmentCard
                  key={assignment.assignmentId}
                  assignment={assignment}
                />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
      {/* Past Assignments */}
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-p">
            Past Assignments{" "}
            <span className="font-normal text-muted-foreground">
              ({pastAssignments.length})
            </span>
          </h3>
          <CollapsibleTrigger asChild className="group">
            <Button size="icon">
              <ChevronUp
                className="group-data-[state=open]:rotate-180 transition-all"
                size={24}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {pastAssignments.length === 0 ? (
            <p className="text-muted-foreground text-center not-found">
              None found
            </p>
          ) : (
            <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-4">
              {pastAssignments.map((assignment) => (
                <ProfessorAssignmentCard
                  key={assignment.assignmentId}
                  assignment={assignment}
                />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AssignmentsPage;
