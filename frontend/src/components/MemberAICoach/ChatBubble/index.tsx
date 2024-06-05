import { Avatar } from "@chakra-ui/react";
import Image from "next/image";
import CommentCard from "src/components/MemberAICoach/CommentCard";

const ChatBubble = (chat: { name: string; message: string; isUser?: boolean }) => {
  return (
    <div className=" flex w-full gap-2 pr-6 max-w-[48.5rem]">
      <Avatar
        size={"sm"}
        // put the greenspace logo here!

        style={{
          objectFit: "cover",
          zIndex: -1,
          background: "white",
        }}
        name="Greenspace AI"
      />

      <CommentCard name={chat.name} message={chat.message} isUser={chat.isUser} />
    </div>
  );
};

export default ChatBubble;
