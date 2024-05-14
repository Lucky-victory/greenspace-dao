import { Box, Heading, Stack, Skeleton, HStack } from "@chakra-ui/react";
export const CardLoading = ({ isLoaded = false }: { isLoaded?: boolean }) => {
  return (
    <HStack wrap={{ base: "wrap", md: "nowrap" }}>
      <Skeleton
        w={{ md: 200, base: "full" }}
        minH={{ md: "100%", base: 200 }}
        maxH={{ base: 250 }}
        bg={"gay.900"}
        rounded={"8px"}
      ></Skeleton>
      <Stack flex={1}>
        <Skeleton h={5} w={"full"} rounded={"15px"}></Skeleton>
        <Skeleton h={12} w={"full"} rounded={"15px"}></Skeleton>
        <HStack>
          <Skeleton h={5} w={"40"} rounded={"15px"}></Skeleton>
          <Skeleton h={5} w={"40"} rounded={"15px"}></Skeleton>
          <Skeleton h={5} w={"40"} rounded={"15px"}></Skeleton>
        </HStack>
        <Skeleton h={6} w={"48"} rounded={"full"}></Skeleton>
      </Stack>
    </HStack>
  );
};
