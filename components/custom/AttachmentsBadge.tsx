import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const AttachmentsBadge = ({
  attachments,
}: {
  attachments: string | string[] | null;
}) => {
  return attachments ? (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="w-fit text-foreground py-2 px-4 border-secondary/50 hover:border-secondary duration-100 border-[1px] rounded-[0.5rem] text-detail cursor-pointer">
          Attachments 📂
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-60 text-subtle flex flex-col gap-2">
        {Array.isArray(attachments) ? (
          attachments.map((attachment, idx) => {
            return (
              <a
                download
                key={idx}
                href={attachment}
                className={`flex items-center w-full gap-2 !justify-start ${buttonVariants(
                  { variant: "outline", size: "sm" }
                )}`}
              >
                Attachment {idx} 📁
                <DownloadIcon className="ml-auto" size={16} />
              </a>
            );
          })
        ) : (
          <a
            download
            href={attachments}
            className={`flex items-center w-full gap-2 !justify-start ${buttonVariants(
              { variant: "outline", size: "sm" }
            )}`}
          >
            Attachment 📁
            <DownloadIcon className="ml-auto" size={16} />
          </a>
        )}
        {Array.isArray(attachments) && (
          <>
            <Separator className="my-1" />
            <Link
              href="#"
              className={`flex items-center w-full gap-2 ${buttonVariants({
                variant: "outline",
                size: "sm",
              })}`}
            >
              Download all ({attachments.length})
            </Link>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  ) : (
    <div className="w-fit py-2 px-4 duration-100 border-[1px] rounded-[0.5rem] text-detail opacity-50">
      No attachments
    </div>
  );
};

export default AttachmentsBadge;
