import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Button,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  InferGetServerSidePropsType,
  type GetServerSidePropsContext,
} from "next";
import { FiChevronRight } from "react-icons/fi";
import {
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
  useActivePeers,
} from "@huddle01/react/hooks";
import MeetingHeader from "@/components/MeetingHeader";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import RemotePeer from "@/components/RemotePeer";
import LocalPeer from "@/components/LocalPeer";
import { ChatArea } from "@/components/ChatArea";
import PageWrapper from "@/components/PageWrapper";
import {
  useCreateTokenMutation,
  useLazyGetMeetingQuery,
} from "@/state/services";
import isEmpty from "just-is-empty";
import { MEETING, TPeerMetadata } from "@/types";
import { useAuth } from "@/hooks";
import PageLoader from "@/components/PageLoader";

interface Props {
  token: string;
}
export default function MeetPage({
  roomId: roomIdFromServer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const toast = useToast({
    duration: 3000,
    position: "top",
    status: "success",
  });
  const roomId = roomIdFromServer || (router.query.roomId as string);
  const [createToken] = useCreateTokenMutation();
  const [meeting, setMeeting] = useState<MEETING | undefined>();
  const [queryMeeting, { isFetching, isLoading }] = useLazyGetMeetingQuery();

  // const { data } = useGetMeetingQuery({ roomId: roomId as string });
  // const meeting = data?.data;

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const activePeers = useActivePeers();

  const [displayName, setDisplayName] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [roomNotFound, setRoomNotFound] = useState<boolean>(false);
  const roomInstance = useRoom({
    onFailed(data) {
      console.log("Failed to join room", { data });
    },
    onJoin: (data) => {
      // data.room
      console.log("onRoomJoin", data);

      updateLocalPeerMetadata({
        displayName: user?.fullName! || displayName,
        avatar: user?.avatar,
        authId: user?.authId!,
        address: user?.address,
        username: user?.username!,
      });
    },
    onWaiting(data) {
      setIsWaiting(
        data.reason === "WAITING_FOR_ADMIN_TO_JOIN" ||
          data.reason === "WAITING_FOR_PERMISSIONS"
      );
    },
    onPeerJoin: (peerId) => {
      console.log("onPeerJoin", peerId);
    },
  });

  const { joinRoom, state, room } = roomInstance;

  const isIdle = state === "idle";
  const isConnecting = state === "connecting";
  const isConnected = state === "connected";

  const { stream: videoStream } = useLocalVideo();

  const { shareStream: shareScreenStream } = useLocalScreenShare();
  const {
    updateMetadata: updateLocalPeerMetadata,
    role,
    metadata,
    peerId: localPeerId,
  } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();

  // useEffect(() => {
  //   if (!shareScreenStream && videoStream && videoRef.current) {
  //     videoRef.current.srcObject = videoStream;
  //   }
  // }, [videoStream, shareScreenStream]);

  // useEffect(() => {
  //   if (shareScreenStream && screenShareRef.current) {
  //     screenShareRef.current.srcObject = shareScreenStream;
  //   }
  // }, [shareScreenStream]);

  async function handleJoinRoom(token?: string) {
    try {
      // setIsJoining(true);
      await joinRoom({
        roomId: roomId as string,
        token: token as string,
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Couldn't join room, please try again",
      });
      console.log("Error while joining room", { error });
    }
  }

  async function handleCreateNewToken() {
    try {
      setIsJoining(true);

      const isCreator = meeting?.userId == user?.authId;

      const tokenResponse = await createToken({
        params: { isCreator, roomId },
        metadata: {
          address: user?.address || "",
          displayName: user?.fullName || displayName,
          avatar: user?.avatar,
          authId: user?.authId!,
        },
      }).unwrap();
      const data = tokenResponse.data;

      setDisplayName(data?.metadata?.displayName as string);
      await handleJoinRoom(data?.token);

      setIsJoining(false);
    } catch (error) {
      console.log({ error });
    }
  }
  useEffect(() => {
    const isCreator =
      !isEmpty(user) && !isEmpty(meeting) && meeting?.userId == user?.authId;
    console.log({ meeting, user, isCreator });
    setIsRoomCreator(isCreator);
  }, [meeting, user]);
  function handleChatAreaMinimize(isMinimized: boolean) {
    setIsMinimized(isMinimized);
  }

  async function startRecording() {
    try {
      setIsRecording(true);
      const recording = await axios("/api/start-recording?roomId=" + roomId);
      console.log({ recording });
    } catch (error) {
      console.log("Error while starting recording");
    }
  }
  async function stopRecording() {
    try {
      const recording = await axios("/api/stop-recording?roomId=" + roomId);
      setIsRecording(false);
      console.log({ recording });
    } catch (error) {
      console.log("Error while stopping recording");
    }
  }
  function isNotBot(remotePeerId: string) {
    return !remotePeerId.includes("bot");
  }

  useEffect(() => {
    async function getMeeting() {
      try {
        setRoomNotFound(false);
        // const roomId = router.query.roomId as string;
        const { data } = await queryMeeting({
          roomId: roomId as string,
        }).unwrap();
        const meeting = data;
        setMeeting(meeting);
        const roomNotFound = isEmpty(meeting);
        setRoomNotFound(roomNotFound);
        if (roomNotFound) {
          // router.push("/404");
        }
      } catch (error) {}
    }
    getMeeting();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  // const hasRemotePeers = peerIds?.length > 0;
  return (
    <PageLoader isLoading={isFetching || isLoading} text="Fetching room...">
      <PageWrapper>
        <Flex
          as="main"
          // h={"var(--chakra-vh)"}
          minH={"700px"}
          maxH={"1000px"}
          bg={"red"}
          p={2}
        >
          {isIdle && (
            <Stack
              gap={4}
              minW={300}
              shadow={"md"}
              mx={"auto"}
              alignSelf={"center"}
              py={8}
              px={6}
              rounded={"md"}
            >
              <Box>
                <Heading mb={2} size={"sm"} fontWeight={500}>
                  Enter your name:
                </Heading>
                <Input
                  colorScheme="gs-yellow"
                  _focus={{
                    boxShadow: "0 0 0 1px gray",
                    borderColor: "gs-yellow.400",
                  }}
                  onKeyUp={async (e: KeyboardEvent) => {
                    if (e.key == "Enter") await handleCreateNewToken();
                  }}
                  placeholder="John doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Box>
              <Button
                rounded={"full"}
                size={"lg"}
                isDisabled={!displayName || displayName.length < 2}
                isLoading={isJoining}
                onClick={async () => await handleCreateNewToken()}
                // colorScheme="teal"
              >
                {isRoomCreator ? "Start Meeting" : "Ask to Join"}
              </Button>
            </Stack>
          )}

          {isConnecting && isWaiting && (
            <Stack
              gap={4}
              minW={300}
              shadow={"sm"}
              mx={"auto"}
              alignSelf={"center"}
              py={8}
              px={6}
              rounded={"md"}
              textAlign={"center"}
            >
              <Heading>Asking to join</Heading>
              <Text>Hold on, someone will let you in soon.</Text>
            </Stack>
          )}
          {!isIdle && isConnected && (
            <Flex direction={"column"} gap={2} flex={1} minH={"full"}>
              <MeetingHeader
                isHost={role === "host"}
                room={room}
                meetingTitle={meeting?.title}
              />
              <Flex
                h={"full"}
                bg={"gray.700"}
                rounded={"15px"}
                p={2}
                gap={3}
                overflow={"hidden"}
                pos={"relative"}
              >
                {/* video area */}
                {/* <Flex
              flexDir={"column"}
              gap={3}
              flex={1}
              minH={"full"}
              transition={"0.65s ease-in-out"}
             */}
                <Flex
                  bg={"blue"}
                  direction={{ base: "column", lg: "row" }}
                  minH="full"
                  flex={1}
                  gap={2}
                  mr={{
                    lg: !isMinimized
                      ? "calc(var(--chat-area-width,330px) + 10px)"
                      : "auto",
                    base: 0,
                  }}
                >
                  <Box maxW={1000} minH={450} w={"full"}>
                    <LocalPeer
                      isPinned={false}
                      {...roomInstance}
                      local={{
                        isRecording: isRecording,
                        onStartRecord: startRecording,
                        onStopRecord: stopRecording,
                        displayName: displayName,
                        metadata: metadata,
                        role: role,
                        activePeers,
                        localPeerId: localPeerId as string,
                      }}
                    />
                  </Box>
                  {/* participants area */}
                  {peerIds.filter((peerId) => isNotBot(peerId))?.length > 0 && (
                    <Flex
                      h={{ lg: "auto", base: 170 }}
                      // w={300}
                      // gap={3}
                      flexShrink={0}
                      overflowX={{ lg: "auto" }}
                      overflowY={{ base: "auto", lg: "hidden" }}
                      p={{ base: "6px 2px", lg: "0 6px " }}
                    >
                      <Flex
                        gap={3}
                        flex={1}
                        flexShrink={0}
                        w={"full"}
                        direction={{ base: "row", lg: "column" }}
                      >
                        {peerIds.map(
                          (peerId) =>
                            isNotBot(peerId) && (
                              <RemotePeer
                                isPinned={false}
                                activePeers={activePeers}
                                key={peerId}
                                peerId={peerId}
                              />
                            )
                        )}
                      </Flex>
                      {/* <IconButton
                        pos={"sticky"}
                        right={0}
                        aria-label="show all participants"
                        h={"full"}
                        colorScheme="gray"
                        rounded={"30px"}
                      >
                        <FiChevronRight />
                      </IconButton> */}
                    </Flex>
                  )}
                </Flex>

                {/* chat area */}

                <ChatArea room={room} onMinimized={handleChatAreaMinimize} />
              </Flex>
            </Flex>
          )}
        </Flex>
      </PageWrapper>
    </PageLoader>
  );
}
export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { roomId } = query;

  // Pass the pathname as props
  return {
    props: {
      roomId: roomId as string,
    },
  };
}
