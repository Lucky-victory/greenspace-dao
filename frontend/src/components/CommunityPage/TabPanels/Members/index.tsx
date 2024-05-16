import { Box, Heading } from "@chakra-ui/react";

export default function Members({ spaceIdOrId }: { spaceIdOrId: string }) {
  return (
    <>
      <Heading size={"md"} fontWeight={600} mb={4}>
        Members
      </Heading>
      <Box>Members here</Box>
    </>
  );
}
