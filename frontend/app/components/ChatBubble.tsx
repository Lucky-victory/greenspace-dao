// import Image from "next/image";
import CommentCard from "@/components/CommentCard";
import { Image } from "@chakra-ui/react";

const ChatBubble = (chat: {
  name: string;
  message: string;
  isUser?: boolean;
}) => {
  return (
    <div className=" flex w-full gap-2 pr-6 max-w-[48.5rem]">
      <div className=" w-full max-w-[70px] h-[70px] overflow-hidden rounded-full relative">
        <Image
          // put the greenspace logo here!
          src={"/icons/favicon-32x32.png"}
          style={{
            objectFit: "cover",
            zIndex: -1,
            // background: "white",
          }}
          alt={`something`}
        />
      </div>
      <CommentCard
        name={chat.name}
        message={chat.message}
        isUser={chat.isUser}
      />
    </div>
  );
};

export default ChatBubble;
