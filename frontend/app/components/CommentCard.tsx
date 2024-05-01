import { cn } from "@/utils/tailwind";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CommentCard = (chat: {
  name: string;
  message: string;
  isUser?: boolean;
  time?: string;
}) => {
  return (
    <div
      className={cn(
        " flex flex-col gap-1 rounded-[20px] border-[1px] border-[#EFF1F8] p-4 w-full min-w-[20rem] shadow-[0_0_50px_7px_rgba(0,0,0,0.05)]",
        chat.isUser ? " bg-slate-100" : "bg-white"
      )}
    >
      <p className=" text-xl font-outfit font-semibold text-[#484E62]">
        {chat.name}
      </p>
      <Markdown className="prose " remarkPlugins={[remarkGfm]}>
        {chat.message}
      </Markdown>
      {chat.time && (
        <p className=" text-[#4C505F] text-sm italic text-end">{chat.time}</p>
      )}
    </div>
  );
};

export default CommentCard;
