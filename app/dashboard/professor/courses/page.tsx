import { AlertCircleIcon } from "lucide-react";
import { auth } from "@/auth";
import { getAvailableCoursesWithRelatedDataByProfessor } from "@/db/queries";
import ProfessorClassCard from "@/components/custom/ProfessorClassCard";

const ClassesPage = async () => {
  const session = await auth();

  const availableClassesWithRelatedData =
    await getAvailableCoursesWithRelatedDataByProfessor(session!.user.id);

  return (
    <div className="dashboard-tab-wrapper">
      <h3 className="text-h3">Your Courses</h3>
      <div className="flex gap-4 flex-wrap">
        {availableClassesWithRelatedData.length > 0 ? (
          availableClassesWithRelatedData.map((obj, idx) => {
            return (
              <ProfessorClassCard
                availableClassWithRelatedData={obj}
                key={idx}
              />
            );
          })
        ) : (
          <div className="not-found">
            <AlertCircleIcon size={16} />
            None found
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
