import { useCheckHasJoinCommunityMutation } from "src/state/services";
import About from "./About";
import Challenges from "./Challenges";
import Chats from "./Chats";
import Events from "./Events";
import Members from "./Members";
import { useInAppAuth } from "src/hooks/common";
import { useEffect } from "react";
import { Community } from "src/types/shared";

export default function TabPanels({
  activeTab = "",
  spaceIdOrId,
  description,
  community,
}: {
  activeTab: string;
  spaceIdOrId: string;
  description: string;
  community: Community;
}) {
  const { connect, isLoggedIn, user } = useInAppAuth();
  const [
    checkCommunityJoin,
    { isLoading: isLoadingHasJoin, data: hasJoinResponse },
  ] = useCheckHasJoinCommunityMutation();
  const hasJoined = hasJoinResponse?.data?.hasJoined;

  useEffect(() => {
    if (isLoggedIn && community?.id) {
      checkCommunityJoin({
        communityId: community?.id,
        userId: user?.id as string,
        spaceIdOrId: community?.spaceId,
      });
    }
  }, [isLoggedIn, community?.id]);
  switch (activeTab) {
    case "":
      return <About spaceIdOrId={spaceIdOrId} description={description} />;

    case "members":
      return <Members spaceIdOrId={spaceIdOrId} />;

    case "events":
      return <Events spaceIdOrId={spaceIdOrId} />;

    case "challenges":
      return <Challenges spaceIdOrId={spaceIdOrId} />;

    case "chats":
      return (
        <Chats
          spaceIdOrId={spaceIdOrId}
          community={community}
          hasJoined={hasJoined}
        />
      );

    default:
      return <About spaceIdOrId={spaceIdOrId} description={description} />;
  }
}
