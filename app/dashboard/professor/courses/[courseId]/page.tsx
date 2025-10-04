import { redirect } from "next/navigation";
const ClassRootPage = ({
  params: { courseId },
}: {
  params: {
    courseId: string;
  };
}) => {
  redirect(`/dashboard/professor/courses/${courseId}/assignments`);
  return <div>page</div>;
};

export default ClassRootPage;
