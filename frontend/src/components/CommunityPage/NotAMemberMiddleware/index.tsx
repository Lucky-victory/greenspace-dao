import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useInAppAuth } from "src/hooks/common";
import { useJoinCommunityMutation } from "src/state/services";
import { Community } from "src/types/shared";

type Props = {
  buttonSize?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
  community: Community;
  styleProps: Record<string, any>;
};
export const NotAMemberMiddlewareComp = ({
  buttonSize = "lg",
  community,
  title = "You are not a member of this community",
  description,
  styleProps,
}: Props) => {
  const { connect, isLoggedIn, user } = useInAppAuth();
  const [joinCommunity, { isLoading: isLoadingJoin }] =
    useJoinCommunityMutation();

  async function handleCommunityJoin() {
    if (!isLoggedIn) {
      connect();
      return;
    }
    await joinCommunity({
      communityId: community?.id,
      userId: user?.id as string,
      spaceIdOrId: community?.spaceId,
    }).unwrap();
  }

  return (
    <Flex
      gap={4}
      px={4}
      flexDir={buttonSize !== "sm" ? "column" : "row"}
      align={"center"}
      justify={buttonSize !== "sm" ? "center" : ""}
      {...styleProps}
    >
      {title && <Text>{title}</Text>}
      {description && <Text>{description}</Text>}
      <Button
        size={buttonSize}
        colorScheme="gs-yellow"
        rounded={"full"}
        loadingText={"Joining..."}
        onClick={handleCommunityJoin}
        isLoading={isLoadingJoin}
      >
        Join
      </Button>
    </Flex>
  );
};
