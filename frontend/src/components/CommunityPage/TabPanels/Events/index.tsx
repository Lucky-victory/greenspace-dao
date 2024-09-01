import { Box, Heading, Stack, Skeleton, HStack } from "@chakra-ui/react";
import EventCard from "./EventCard";
import { useGetCommunitiesQuery, useGetCommunityEventsQuery } from "src/state/services";
import { CardLoading } from "src/components/CommunityPage/CardLoading";
import isEmpty from "just-is-empty";
import { TabHeading } from "../../TabHeading";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import { ChallengeSkeleton } from "../Challenges";
export default function Events({ spaceIdOrId }: { spaceIdOrId: string }) {
  const { data, isLoading, isFetching } = useGetCommunityEventsQuery({
    spaceIdOrId: spaceIdOrId
  });
  const events = data?.data as any[];

  return (
    <Stack flex={1} maxH={"full"} overflowY={"auto"} pb={6} className="no-scrollbar">
      <TabHeading title="Events" />
      <Stack gap={5}>
        {(isLoading || isFetching) && [0, 0, 0, 0].map((_, i) => <ChallengeSkeleton key={"evt-loading" + i} />)}
        {!isLoading && !isFetching && isEmpty(events) && (
          <DashboardEmptyArea text="No events yet" isEmpty={true} isLoading={false} />
        )}
        {!isLoading &&
          !isFetching &&
          !isEmpty(events) &&
          events.map((event, i) => <EventCard spaceIdOrId={spaceIdOrId} key={"event" + i} event={event} />)}
      </Stack>
    </Stack>
  );
}
