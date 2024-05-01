import { Box, Heading, Stack } from "@chakra-ui/react";
import ChallengeCard from "./ChallengeCard";

export default function Challenges({ spaceIdOrId }: { spaceIdOrId: string }) {
  return (
    <Box pb={6}>
      <Heading size={"lg"} fontWeight={600} mb={4}>
        Challenges
      </Heading>
      <Stack gap={5}>
        {[0, 0].map((event, i) => (
          <ChallengeCard spaceIdOrId={spaceIdOrId} key={i} />
        ))}
      </Stack>
    </Box>
  );
}
