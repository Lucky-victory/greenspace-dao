const SamplePromptsCard = (card: { title: string; body: string }) => {
  return (
    <div className=" flex flex-col gap-1 rounded-[20px] border-[1px] border-[#EFF1F8] p-4 w-min min-w-[20rem] shadow-[0_0_50px_7px_rgba(0,0,0,0.05)] bg-white">
      <p className=" text-lg text-[#484E62] font-semibold font-outfit">
        {card.title}
      </p>
      <p className=" text-[#4C505F]">{card.body}</p>
    </div>
  );
};

export default SamplePromptsCard;
