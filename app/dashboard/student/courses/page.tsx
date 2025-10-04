import { auth } from "@/auth";
import PESStudentClassCard from "@/components/custom/StudentClassCard";
import { getCoursesWithRelatedDataByStudent } from "@/db/queries";
import { Info } from "lucide-react";

const StudentCoursesPage = async () => {
  const session = await auth();

  const availableCoursesWithRelatedDataResponse =
    await getCoursesWithRelatedDataByStudent(session!.user.id);

  return (
    <div className="dashboard-tab-wrapper">
      {availableCoursesWithRelatedDataResponse.error ||
      !availableCoursesWithRelatedDataResponse.data ? (
        <div className="not-found">Error retrieving courses data.</div>
      ) : availableCoursesWithRelatedDataResponse.data.length > 0 ? (
        <>
          <h3 className="text-h3">Your Courses</h3>
          <div className="flex gap-4 flex-wrap">
            {availableCoursesWithRelatedDataResponse.data.map((obj, idx) => {
              return (
                <PESStudentClassCard
                  availableCoursesWithRelatedData={obj}
                  key={idx}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="not-found">
          <Info size={16} />
          <div>You are not currently assigned to any courses</div>
        </div>
      )}
    </div>
  );
};

export default StudentCoursesPage;
