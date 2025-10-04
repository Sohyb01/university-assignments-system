import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfessorNavbar from "@/components/custom/ProfessorNavbar";
import ProfessorSidebar from "@/components/custom/ProfessorSidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session || session.user.role !== "professor") redirect("/login");

  return (
    <div
      className="antialiased flex flex-col w-full h-[100vh] overflow-hidden"
      dir="ltr"
    >
      <ProfessorNavbar />
      <div className="flex w-full overflow-hidden dashboard-sizing">
        <ProfessorSidebar />
        <main className="w-full flex flex-col gap-8 p-4 md:p-8 lg:pl-12 dashboard-sizing overflow-scroll bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
