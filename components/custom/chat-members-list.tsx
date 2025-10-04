import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Member = {
  student_id: string;
  first_name: string;
  last_name: string;
  role: string;
  image?: string | null;
};

const ChatMembersList = ({ members }: { members: Member[] }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex gap-1 items-center group cursor-pointer">
          {members.slice(0, 3).map((member, index) => (
            <Avatar key={index} className="w-8 h-8">
              <AvatarImage src={member.image ?? ""} alt="@shadcn" />
              <AvatarFallback className="capitalize">
                {member.first_name[0] + member.last_name[0]}
              </AvatarFallback>
            </Avatar>
          ))}
          {members.length > 3 && (
            <span className="text-muted-foreground text-detail group group-hover:text-foreground duration-100">
              +{members.length - 3} Members
            </span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[400px]">
        {/* <div className="text-p_ui">Group Members</div> */}
        <div className="max-h-[400px] overflow-y-scroll flex flex-col gap-4 text-subtle pt-2">
          {members.map((member, index) => (
            <div key={index} className="flex gap-4 items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.image ?? ""} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                {member.first_name} {member.last_name}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatMembersList;
