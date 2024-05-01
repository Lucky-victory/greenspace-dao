import {
  Avatar,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Input,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { pusherClient } from "@/lib/pusher/client";
import { FormEvent, FormEventHandler, useEffect, useRef } from "react";
import { Channel } from "pusher-js";
import { useFormik } from "formik";
import { useAuth } from "@/hooks";
import { FiSend } from "react-icons/fi";
import { useGetCommunityMessagesQuery } from "@/state/services";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/state/store";
import { addMessage } from "@/state/slices";
import CommunityChatInput from "./ChatInput";

export default function Chats({ spaceIdOrId }: { spaceIdOrId: string }) {
  const { user } = useAuth();
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
    <>
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

      <Box pos={"relative"}>
        <Stack divider={<Divider />} pb={24}>
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
                px={3}
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
                  <HStack align={"flex-start"}>
                    <Text fontWeight={600}>{message?.author?.fullName}</Text>
                  </HStack>
                  <Text fontSize={"15px"} fontWeight={300}>
                    {message?.message}
                  </Text>
                </Stack>
              </HStack>
            ))}
        </Stack>
      </Box>
      <CommunityChatInput user={user} spaceIdOrId={spaceIdOrId} />
    </>
  );
}

export const ChatLoading = ({ isLoaded = false }: { isLoaded?: boolean }) => {
  return (
    <HStack>
      <SkeletonCircle w={10} h={10} />
      <Stack flex={1}>
        <Skeleton h={3} w={"full"} rounded={"full"}></Skeleton>
        <Skeleton h={3} w={"40"} rounded={"full"}></Skeleton>
        <Skeleton h={3} w={"full"} rounded={"full"}></Skeleton>
      </Stack>
    </HStack>
  );
};
