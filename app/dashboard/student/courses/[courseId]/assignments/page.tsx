import { auth } from "@/auth";
import StudentAssignmentCard from "@/components/custom/StudentAssignmentCard";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getStudentAssignmentsWithRelevantDataByCourse } from "@/db/queries";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronUp } from "lucide-react";

const Assignments = async ({ params }: { params: { courseId: string } }) => {
  const session = await auth();

  const assignmentData = await getStudentAssignmentsWithRelevantDataByCourse(
    session!.user!.id,
    params.courseId
  );
  return (
    <div className="overflow-y-scroll flex flex-col gap-8">
      {/* Due Assignments */}
      <Collapsible defaultOpen>
        <div className="flex item-center justify-between mb-4">
          <h3 className="my-auto text-h4">
            Due Assignments{" "}
            <span className="font-normal text-muted-foreground">
              ({assignmentData.dueAssignments.length})
            </span>
          </h3>
          <CollapsibleTrigger asChild className="group">
            <Button size="icon">
              <ChevronUp
                className="group-data-[state=open]:rotate-180 transition-all"
                size={16}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {assignmentData.dueAssignments.length === 0 ? (
            <p className="text-muted-foreground text-center not-found">
              None found
            </p>
          ) : (
            <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-4">
              {assignmentData.dueAssignments.map((assignment) => {
                return (
                  <StudentAssignmentCard
                    key={assignment.assignmentId}
                    assignment={assignment}
                  />
                );
              })}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Past Assignments */}
      <Collapsible defaultOpen>
        <div className="flex item-center justify-between mb-4">
          <h3 className="my-auto text-h4">
            Submitted & Past Assignments{" "}
            <span className="font-normal text-muted-foreground">
              ({assignmentData.pastAssignments.length})
            </span>
          </h3>
          <CollapsibleTrigger asChild className="group">
            <Button size="icon">
              <ChevronUp
                className="group-data-[state=open]:rotate-180 transition-all"
                size={16}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          {assignmentData.pastAssignments.length === 0 ? (
            <p className="text-muted-foreground text-center not-found">
              None found
            </p>
          ) : (
            <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-4">
              {assignmentData.pastAssignments.map((assignment) => {
                return (
                  <StudentAssignmentCard
                    key={assignment.assignmentId}
                    assignment={assignment}
                  />
                );
              })}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Assignments;
