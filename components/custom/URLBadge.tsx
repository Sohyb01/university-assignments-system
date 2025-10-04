import Link from "next/link";

const URLBadge = ({ url }: { url: string }) => {
  return (
    <Link
      href={url}
      className="w-fit text-foreground py-2 px-4 border-primary/50 hover:border-primary duration-100 border-[1px] rounded-[0.5rem] text-detail cursor-pointer"
    >
      URL 🔗
    </Link>
  );
};
export default URLBadge;
