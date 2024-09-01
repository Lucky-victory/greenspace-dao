import { Box, Heading, Stack, Skeleton, SkeletonText, Flex } from "@chakra-ui/react";
import ChallengeCard from "./ChallengeCard";
import { CardLoading } from "../../CardLoading";
import { useGetCommunityChallengesQuery } from "src/state/services";
import isEmpty from "just-is-empty";
import { TabHeading } from "../../TabHeading";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";

export function ChallengeSkeleton() {
  return (
    <Flex gap={3} wrap={{ base: "wrap", md: "nowrap" }} py={3} px={3} className="no-scrollbar">
      <Box flexShrink={0} w={{ md: 200, base: "full" }} minH={{ md: "100%", base: 200 }} maxH={{ base: 250 }}>
        <Skeleton height="100%" width="100%" />
      </Box>
      <Stack flex={1}>
        <Skeleton height="24px" width="200px" rounded={"lg"} />
        <SkeletonText mt="4" noOfLines={3} spacing="4" rounded={"lg"} />
        <Stack direction="row" mt="4" rounded={"lg"}>
          <Skeleton height="20px" width="60px" rounded={"lg"} />
          <Skeleton height="20px" width="60px" rounded={"lg"} />
          <Skeleton height="20px" width="60px" rounded={"lg"} />
        </Stack>
        <Skeleton height="40px" width="120px" mt="4" rounded={"lg"} />
      </Stack>
    </Flex>
  );
}

export default function Challenges({ spaceIdOrId }: { spaceIdOrId: string }) {
  const {
    data: challengesResponse,
    isLoading,
    isFetching
  } = useGetCommunityChallengesQuery({
    spaceIdOrId: spaceIdOrId
  });
  const challenges = challengesResponse?.data;
  return (
    <Stack flex={1} maxH={"full"} overflowY={"auto"} pb={6}>
      <TabHeading title="Challenges" />
      <Stack gap={5}>
        {(isLoading || isFetching) && [0, 0, 0, 0].map((_, i) => <ChallengeSkeleton key={"challenge-loading" + i} />)}
        {!isLoading && !isFetching && isEmpty(challenges) && (
          <DashboardEmptyArea text="No challenges yet" isEmpty={true} isLoading={false} />
        )}
        {!isLoading &&
          !isFetching &&
          !isEmpty(challenges) &&
          challenges?.map((challenge, i) => <ChallengeCard challenge={challenge} spaceIdOrId={spaceIdOrId} key={i} />)}
      </Stack>
    </Stack>
  );
}
