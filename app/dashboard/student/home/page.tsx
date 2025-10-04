import { auth } from "@/auth";

const StudentHomepage = async () => {
  const session = await auth();

  return (
    <div className="flex flex-col gap-8 w-full">
      <h3 className="text-h2">Hello, {session?.user.first_name}! 👋</h3>
      <div className="flex flex-wrap gap-8">Homepage</div>
    </div>
  );
};

export default StudentHomepage;
