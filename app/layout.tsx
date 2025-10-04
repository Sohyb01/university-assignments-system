import type { Metadata } from "next";
import { Toaster } from "sonner";
import CustomSessionProvider from "@/components/custom/SessionProvider";
import "@/app/css/components.css";
import "@/app/globals.css";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "University Submission Assessment System",
  description: "University Submission Assessment System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("env; ", process.env.AUTH_SECRET);
  const session = await auth();

  return (
    <html className="h-[100vh]">
      <body className={`flex flex-col items-center h-full`}>
        <CustomSessionProvider refetchOnWindowFocus={false} session={session}>
          {children}
          <Toaster richColors position="top-center" />
        </CustomSessionProvider>
      </body>
    </html>
  );
}
