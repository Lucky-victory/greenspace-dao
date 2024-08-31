import {
  Avatar,
  Box,
  Divider,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Fade,
  Flex
} from "@chakra-ui/react";
import { pusherClient } from "src/lib/pusher/client";
import { useEffect, useRef } from "react";
import { Channel } from "pusher-js";

import { useGetCommunityMessagesQuery } from "src/state/services";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "src/state/store";
import { addMessage } from "src/state/slices";
import CommunityChatInput from "./ChatInput";
import { usePrivy } from "@privy-io/react-auth";
import { formatChatTimestamp } from "src/helpers";
import { NotAMemberMiddlewareComp } from "../../NotAMemberMiddleware";
import { TabHeading } from "../../TabHeading";
import { useScrollToBottom } from "src/hooks/common";

export default function Chats({ spaceIdOrId }: { spaceIdOrId: string }) {
  const { user } = usePrivy();
  const { containerRef } = useScrollToBottom(true);
  const { data: messagesRes, isFetching, isLoading } = useGetCommunityMessagesQuery({ spaceIdOrId });

  const dispatch = useAppDispatch();
  const messages = useSelector((state: RootState) => state.communityMessagesState.data);

  const channelRef = useRef<Channel>();

  useEffect(() => {
    channelRef.current = pusherClient.subscribe(spaceIdOrId).bind("evt::message", (data: any) => {
      dispatch(addMessage(data));
    });

    return () => {
      if (channelRef.current) channelRef.current.unbind();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, spaceIdOrId]);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const messageBgColor = useColorModeValue("white", "gray.800");

  return (
    <Flex direction="column" h="full" bg={bgColor}>
      <TabHeading title="Chats" />

      <VStack flex={1} spacing={4} overflowY="auto" p={4} ref={containerRef}>
        {(isFetching || isLoading) && (
          <VStack spacing={4} w="full">
            {[0, 1, 2, 3, 4].map((_, i) => (
              <ChatLoading key={`loading-skeleton-${i}`} />
            ))}
          </VStack>
        )}
        {!isFetching && !isLoading && messages?.length === 0 && (
          <Flex justify="center" align="center" h="full">
            <Text color={secondaryTextColor} fontSize="lg">
              No messages yet.
            </Text>
          </Flex>
        )}
        {!isFetching && !isLoading && messages?.length > 0 && (
          <VStack spacing={4} w="full" align="stretch">
            {messages.map((message: any, index: number) => (
              <Fade in={true} key={`${message?.id}-${index}`}>
                <Box bg={messageBgColor} p={4} borderRadius="lg" boxShadow="sm">
                  <HStack spacing={3} align="flex-start">
                    <Avatar size="md" name={message?.author?.fullName} src={message?.author?.avatar} />
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight={600} color={textColor}>
                          {message?.author?.fullName}
                        </Text>
                        <Text fontSize="xs" color={secondaryTextColor}>
                          {formatChatTimestamp(message?.createdAt)}
                        </Text>
                      </HStack>
                      <Text color={textColor}>{message?.message}</Text>
                    </VStack>
                  </HStack>
                </Box>
              </Fade>
            ))}
          </VStack>
        )}
      </VStack>

      <Box bg={bgColor} borderTop="1px" borderColor={useColorModeValue("gray.200", "gray.700")} p={4}>
        <NotAMemberMiddlewareComp
          spaceIdOrId={spaceIdOrId}
          buttonSize="md"
          styleProps={{
            w: "full",
            textAlign: "center"
          }}
          title="Join this community to send a message"
        >
          <CommunityChatInput user={user} spaceIdOrId={spaceIdOrId} />
        </NotAMemberMiddlewareComp>
      </Box>
    </Flex>
  );
}

export const ChatLoading = () => {
  return (
    <HStack w="full" spacing={3} p={4} bg={useColorModeValue("white", "gray.800")} borderRadius="lg" boxShadow="sm">
      <SkeletonCircle size="12" />
      <VStack align="start" spacing={2} flex={1}>
        <Skeleton height="20px" width="40%" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="80%" />
      </VStack>
    </HStack>
  );
};
