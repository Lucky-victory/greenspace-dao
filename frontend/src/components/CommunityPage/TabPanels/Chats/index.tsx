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

export default function Chats({
  spaceIdOrId,
  
}: {
  spaceIdOrId: string;

}) {
  const { user } = usePrivy();
  const {
    data: messagesRes,
    isFetching,
    isLoading,
  } = useGetCommunityMessagesQuery({ spaceIdOrId });

  const dispatch = useAppDispatch();
  const messages = useSelector(
    (state: RootState) => state.communityMessagesState.data
  );

  const channelRef = useRef<Channel>();

  useEffect(() => {
    channelRef.current = pusherClient
      .subscribe(spaceIdOrId)
      .bind("evt::message", (data: any) => {
        console.log("test", data);
        dispatch(addMessage(data));
      });

    return () => {
      if (channelRef.current) channelRef.current.unbind();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, spaceIdOrId]);

  return (
    <Stack flex={1} maxH={"full"}>
      <Heading
        size={"lg"}
        fontWeight={600}
        mb={4}
        borderBottom={"2px"}
        borderColor={"gray.800"}
        pb={2}
      >
        Chats
      </Heading>

      <Stack divider={<Divider />} h={"full"} overflowY={"auto"}>
        {(isFetching || isLoading) &&
          [0, 0, 0, 0, 0, 0].map((_, i) => (
            <ChatLoading key={"loading-skeleton" + i} />
          ))}
        {!isFetching && !isLoading && messages?.length === 0 && (
          <Box py={8} textAlign={"center"}>
            <Text> No messages yet.</Text>
          </Box>
        )}
        {!isFetching &&
          !isLoading &&
          messages?.length > 0 &&
          messages.map((message: any, index: number) => (
            <HStack
              py={3}
              px={{ base: 1, md: 3 }}
              rounded={"md"}
              // bg={"gs-gray.900"}
              gap={3}
              key={message?.id + "" + index}
              align={"flex-start"}
            >
              <Avatar
                mt={1}
                size={"sm"}
                name={message?.author?.fullName}
                src={message?.author?.avatar}
              />
              <Stack>
                <HStack>
                  <Text fontWeight={600}>{message?.author?.fullName}</Text>
                  <Text fontSize={"12px"} color={"gray.500"}>
                    {formatChatTimestamp(message?.createdAt)}
                  </Text>
                </HStack>
                <Text fontSize={"15px"} fontWeight={300}>
                  {message?.message}
                </Text>
              </Stack>
            </HStack>
          ))}
      </Stack>
  
        <NotAMemberMiddlewareComp spaceIdOrId={spaceIdOrId} 
          buttonSize={"md"}
          styleProps={{
            pos: "sticky",
            bottom: 0,
            bg: "gray.800",
            w: "full",
            py: 3,
            textAlign: "center",
          }}
          title="Join this community to send a message"
        
        >

   
        <CommunityChatInput user={user} spaceIdOrId={spaceIdOrId} />
        </NotAMemberMiddlewareComp>
    
    </Stack>
  );
}

export const ChatLoading = ({ isLoaded = false }: { isLoaded?: boolean }) => {
  return (
    <HStack>
      <SkeletonCircle w={10} h={10} />
      <Stack flex={1}>
        <Skeleton h={4} w={"full"} rounded={"full"}></Skeleton>
        <Skeleton h={4} w={"40"} rounded={"full"}></Skeleton>
        <Skeleton h={4} w={"full"} rounded={"full"}></Skeleton>
      </Stack>
    </HStack>
  );
};
