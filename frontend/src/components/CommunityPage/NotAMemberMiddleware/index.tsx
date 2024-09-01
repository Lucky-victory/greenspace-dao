import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ReactNode, useCallback, useEffect } from "react";
import { useInAppAuth } from "src/hooks/common";
import { useCheckHasJoinCommunityMutation, useGetCommunityQuery, useJoinCommunityMutation } from "src/state/services";
import { Community } from "src/types/shared";

type Props = {
  buttonSize?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
  spaceIdOrId: string;
  styleProps: Record<string, any>;
  children?: ReactNode;
};
export const NotAMemberMiddlewareComp = ({
  buttonSize = "lg",
  spaceIdOrId,
  title = "Join this community",
  description,
  styleProps,
  children
}: Props) => {
  const { connect, isLoggedIn, user } = useInAppAuth();
  const { data: communityResponse } = useGetCommunityQuery({
    spaceIdOrId
  });
  const community = communityResponse?.data!;
  const [joinCommunity, { isLoading: isLoadingJoin }] = useJoinCommunityMutation();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const buttonColorScheme = useColorModeValue("yellow", "blue");

  async function handleCommunityJoin() {
    if (!isLoggedIn) {
      connect();
      return;
    }
    await joinCommunity({
      communityId: community?.id,
      userId: user?.id as string,
      spaceIdOrId: community?.spaceId
    }).unwrap();
    await checkCommunityJoin({
      communityId: community?.id,
      userId: user?.id as string,

      spaceIdOrId: community?.spaceId
    }).unwrap();
  }
  const [checkCommunityJoin, { isLoading: isLoadingHasJoin, data: hasJoinResponse }] =
    useCheckHasJoinCommunityMutation();
  const hasJoined = hasJoinResponse?.data?.hasJoined;

  const checkCommunityJoinCb = useCallback(checkCommunityJoin, [isLoggedIn, spaceIdOrId, checkCommunityJoin]);
  useEffect(() => {
    if (isLoggedIn && community?.id) {
      checkCommunityJoinCb({
        communityId: community?.id,
        userId: user?.id as string,

        spaceIdOrId: community?.spaceId
      });
    }
  }, [isLoggedIn, user?.id, community?.spaceId, community?.id, checkCommunityJoinCb]);
  return (
    <>
      {!isLoadingHasJoin && hasJoined && children ? children : <></>}
      {((!isLoadingHasJoin && !hasJoined) || !isLoggedIn) && (
        <Flex
          gap={4}
          px={4}
          flexDir={buttonSize !== "sm" ? "column" : "row"}
          align={"center"}
          justify={buttonSize !== "sm" ? "center" : ""}
          bg={bgColor}
          color={textColor}
          pos={"fixed"}
          bottom={0}
          left={0}
          right={0}
          zIndex={1000}
          pb={4}
          {...styleProps}
        >
          {title && <Text>{title}</Text>}
          {description && <Text>{description}</Text>}
          <Button
            size={buttonSize}
            colorScheme={buttonColorScheme}
            rounded={"full"}
            loadingText={"Joining..."}
            onClick={handleCommunityJoin}
            isLoading={isLoadingJoin}
          >
            Become a member
          </Button>
        </Flex>
      )}
    </>
  );
};
