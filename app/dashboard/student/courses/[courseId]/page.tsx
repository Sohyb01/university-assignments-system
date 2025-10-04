import { redirect } from "next/navigation";

const ClassRoot = ({
  params: { courseId },
}: {
  params: {
    courseId: string;
  };
}) => {
  return redirect(`/dashboard/student/courses/${courseId}/assignments`);
};

export default ClassRoot;
