import { Box, Text } from "@chakra-ui/react";

const SamplePromptsCard = (card: { title: string; body: string }) => {
  return (
    <Box
      bg={"gray.800"}
      className=" flex flex-col gap-1 rounded-[20px] border-[1px] border-[#4C505F] p-4 w-min min-w-[20rem] shadow-[0_0_50px_7px_rgba(0,0,0,0.05)] "
    >
      <Text className=" text-lg  font-semibold font-outfit" color="gray.50">
        {card.title}
      </Text>
      <Text className=" " color="gray.50">
        {card.body}
      </Text>
    </Box>
  );
};

export default SamplePromptsCard;
