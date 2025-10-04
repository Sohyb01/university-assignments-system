import { auth } from "@/auth";
import StudentNavbar from "@/components/custom/StudentNavbar";
import StudentSidebar from "@/components/custom/StudentSidebar";
import { redirect } from "next/navigation";

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  if (!session || session.user.role !== "student") redirect("/login");

  return (
    <div
      className={`antialiased flex flex-col w-full h-[100vh] overflow-hidden bg-shade`}
      dir="ltr"
    >
      <StudentNavbar />
      <div className="flex w-full dashboard-sizing gradient-bg p-4 gap-4 md:gap-8">
        <StudentSidebar />
        {/* Main Content */}
        <main id="pdf-root" className="w-full p-4 overflow-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
