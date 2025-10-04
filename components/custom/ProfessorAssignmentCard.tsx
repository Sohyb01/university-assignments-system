"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import TimeLeftBadge from "./TimeLeftBadge";
import { useSession } from "next-auth/react";
import { ProfessorAssignment } from "@/db/queries";

export type ProfessorAssignmentCardProps = {
  assignment: ProfessorAssignment;
};

const ProfessorAssignmentCard: React.FC<ProfessorAssignmentCardProps> = ({
  assignment,
}) => {
  const now = new Date();
  const { data: session } = useSession();

  // Determine if the assignment is due or past based on its dueDate.
  const isPastAssignment = assignment.dueDate < now;

  return (
    <Card className="bg-background w-full rounded-[1rem] md:min-w-[300px] lg:min-w-[480px] max-w-[480px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-h4">{assignment.assignmentName}</span>
          {/* Show a badge for due date status */}
          {isPastAssignment && <Badge variant="outline">Past Due</Badge>}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{assignment.courseName}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-subtle">
        <div>
          <p className="font-medium text-muted-foreground">Due Date</p>
          <p>{format(assignment.dueDate, "MMMM dd, yyyy, hh:mm a")}</p>
        </div>
        {!isPastAssignment && assignment.dueDate > now && (
          <TimeLeftBadge endDate={assignment.dueDate} />
        )}
        <div>
          <p className="font-medium text-muted-foreground">Description</p>
          <p className="line-clamp-2">
            {assignment.description || "No description"}
          </p>
        </div>
        <div>
          <p className="font-medium">
            {assignment.submissions.length} Submissions
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex gap-2">
        {/* A button/link to review submissions */}
        {(session?.user.role === "professor" ||
          session?.user.role === "superadmin") && (
          <Link
            href={`assignments/${assignment.assignmentId}`}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              " flex gap-2 items-center"
            )}
          >
            <Eye size={16} />
            View Submissions
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfessorAssignmentCard;
