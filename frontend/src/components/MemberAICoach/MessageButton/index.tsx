import React from "react";

const MessageButton = ({ onClick }: { onClick: any }) => {
  return (
    <button
      {...{ onClick }}
      className=" h-min bg-black px-[18px] py-3 rounded-3xl text-white grid place-items-center cursor-pointer font-outfit"
    >
      Add Question
    </button>
  );
};

export default MessageButton;
