import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  useLocalAudio,
  useLocalScreenShare,
  useLocalVideo,
} from "@huddle01/react/hooks";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsRecordCircle, BsStopCircle } from "react-icons/bs";
import {
  FiMic,
  FiMicOff,
  FiPhone,
  FiStopCircle,
  FiUser,
  FiVideo,
  FiVideoOff,
} from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { Room } from "@huddle01/web-core";
import { Video, Audio } from "@huddle01/react/components";
import { RoomStates } from "@huddle01/web-core/types";
import Dialog from "./MeetingDialog";

export interface Props {
  isPinned: false;
  local: Record<string, any> & {
    isRecording: boolean;
    onStartRecord: () => Promise<void>;
    onStopRecord: () => Promise<void>;
    activePeers: {
      activePeerIds: string[];
      dominantSpeakerId: string;
      updateSize: (size: number) => void;
    };
    role: string | null;
    localPeerId: string;
    displayName: string;
  };
  state: RoomStates;
  room: Room;
  joinRoom: (data: { roomId: string; token: string }) => Promise<Room>;
  leaveRoom: () => void;
  closeRoom: () => void;
  kickPeer: (peerId: string) => Promise<void>;
  muteEveryone: () => Promise<void>;
  closeStreamOfLabel: (data: {
    label: string;
    peerIds?: string[] | undefined;
  }) => Promise<void>;
}
export default function LocalPeer(props: Props) {
  const isHost = props.local.role === "host";

  // const [displayName, setDisplayName] = useState<string>("Lucky");
  const videoRef = useRef<HTMLVideoElement>(null);
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const { activePeers, localPeerId } = props.local;
  const { activePeerIds, dominantSpeakerId } = activePeers;

  const localVideo = useLocalVideo();
  const { isVideoOn, stream: videoStream } = localVideo;
  const localAudio = useLocalAudio();
  const { stream: audioStream } = localAudio;
  const localScreenShare = useLocalScreenShare();
  const { shareStream: shareScreenStream } = localScreenShare;
  useEffect(() => {
    if (!shareScreenStream && videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, shareScreenStream]);

  useEffect(() => {
    if (shareScreenStream && screenShareRef.current) {
      screenShareRef.current.srcObject = shareScreenStream;
    }
  }, [shareScreenStream]);
  useEffect(() => {
    if (videoStream && shareScreenStream && miniVideoRef.current) {
      miniVideoRef.current.srcObject = videoStream;
    }
  }, [shareScreenStream, videoStream]);

  useEffect(() => {
    if (dominantSpeakerId == localPeerId && audioStream) {
      setIsSpeaking(true);
    } else {
      setIsSpeaking(false);
    }
  }, [dominantSpeakerId, localPeerId, audioStream]);

  return (
    <>
      <Flex
        flex={1}
        overflow={"hidden"}
        pos={"relative"}
        rounded={"10px"}
        w={"full"}
        h={"full"}
        transition={"ease-in-out"}
        transitionProperty={"boxShadow"}
        boxShadow={isSpeaking ? "0 0 0 2px yellow" : "none"}
        bg={"gray.800"}
        // p={4}
      >
        {props.state === "connected" && (
          <>
            {/* Video header area */}
            <HStack
              zIndex={100}
              pos={"absolute"}
              w={"full"}
              justify={"space-between"}
              p={3}
            >
              <Box
                rounded={"full"}
                px={3}
                py={1}
                bg={"blackAlpha.400"}
                backdropFilter={"auto"}
                backdropBlur={"5px"}
                color="white"
              >
                <Text as={"span"} fontWeight={500}>
                  {props.local?.displayName} (You)
                </Text>
              </Box>
              {isHost && props.local.isRecording && (
                <Flex
                  rounded={"full"}
                  align={"center"}
                  px={3}
                  py={1}
                  gap={2}
                  fontWeight={500}
                  bg={"blackAlpha.400"}
                  backdropFilter={"auto"}
                  backdropBlur={"10px"}
                  color={"white"}
                >
                  <FiStopCircle />
                  <Text as={"span"}>Recording...</Text>
                </Flex>
              )}
            </HStack>
            {shareScreenStream && videoStream && (
              <Box
                w={"240px"}
                border={"2px"}
                borderColor={"gray.600"}
                zIndex={3}
                h={"150px"}
                rounded={"lg"}
                pos={"absolute"}
                overflow={"hidden"}
                top={2}
                left={2}
              >
                <Box
                  as={Video}
                  stream={videoStream}
                  muted
                  autoPlay
                  // ref={miniVideoRef}
                  h={"full"}
                  w={"full"}
                  left={0}
                  top={0}
                  // aspectRatio={"16:9"}
                  objectFit={"cover"}
                  pos={"absolute"}
                ></Box>
              </Box>
            )}
            {!(isVideoOn || shareScreenStream) && (
              <Stack flex={1} align={"center"} justify={"center"} h={"full"}>
                <Avatar
                  name={props?.local?.displayName}
                  size={"xl"}
                  src={props.local?.metadata?.avatar}
                  icon={<FiUser size={50} />}
                />
              </Stack>
            )}
            {isVideoOn && (
              <Box pos={"relative"} h={"full"} w={"full"}>
                <Box
                  as={Video}
                  stream={videoStream!}
                  muted
                  autoPlay
                  h={"full"}
                  w={"full"}
                  left={0}
                  top={0}
                  // ref={videoRef}
                  rounded={"md"}
                  bg={"gray.800"}
                  // aspectRatio={"16/9"}
                  objectFit={"cover"}
                  pos={"absolute"}
                ></Box>
              </Box>
            )}
            {shareScreenStream && (
              <Box
                as={Video}
                stream={shareScreenStream!}
                muted
                bg={"gray.800"}
                autoPlay
                // ref={screenShareRef}
                h={"full"}
                w={"full"}
                left={0}
                top={0}
                rounded={"md"}
                // aspectRatio={"16/9"}
                objectFit={"contain"}
                pos={"absolute"}
              ></Box>
            )}
          </>
        )}

        {props.state == "connecting" && (
          <Flex
            gap={5}
            w={"full"}
            h={"full"}
            justify={"center"}
            align={"center"}
          >
            <Spinner
              thickness="4px"
              speed="0.75s"
              emptyColor="gray.800"
              color="gs-yellow.300"
              size="xl"
            />
            <Text fontSize={"20px"}>Connecting...</Text>
          </Flex>
        )}
        {/* video controls area */}
        {props.state === "connected" && (
          <Controls
            localVideo={localVideo}
            {...props}
            localScreenShare={localScreenShare}
            localAudio={localAudio}
          />
        )}
      </Flex>
    </>
  );
}

type ControlProps = Props & {
  localVideo: {
    stream: MediaStream | null;
    track: MediaStreamTrack | null;
    isVideoOn: boolean;
    enableVideo: (
      customVideoStream?: MediaStream | undefined
    ) => Promise<MediaStream | undefined>;
    disableVideo: () => Promise<void>;
    // replaceVideoStream: (stream: MediaStream) => Promise<void>;
    // changeVideoSource: (deviceId: string) => Promise<void>;
  };
  localAudio: {
    stream: MediaStream | null;
    track: MediaStreamTrack | null;
    isAudioOn: boolean;
    enableAudio: (
      customAudioStream?: MediaStream | undefined
    ) => Promise<MediaStream | undefined>;

    disableAudio: () => Promise<void>;
    // replaceAudioStream: (stream: MediaStream) => Promise<void>;
    // changeAudioSource: (deviceId: string) => Promise<void>;
  };
  localScreenShare: {
    shareStream: MediaStream | null;
    startScreenShare: () => Promise<MediaStream | undefined>;
    stopScreenShare: () => Promise<void>;
    // audioTrack: MediaStreamTrack | null;
    // videoTrack: MediaStreamTrack | null;
  };
};
export const Controls = ({
  localAudio,
  localScreenShare,
  localVideo,
  ...props
}: ControlProps) => {
  const isIdle = props.state === "idle";
  const isHost = props.local.role === "host";

  const [isMutedAll, setIsMutedAll] = useState<boolean>(false);
  const router = useRouter();
  async function handleControls(
    type: "audio" | "video" | "screen" | "record" | "muteAll"
  ) {
    switch (type) {
      case "audio":
        try {
          localAudio.isAudioOn
            ? await localAudio.disableAudio()
            : await localAudio.enableAudio();
        } catch (error) {}

        break;
      case "video":
        try {
          localVideo.isVideoOn
            ? await localVideo.disableVideo()
            : await localVideo.enableVideo();
        } catch (error) {}
        break;
      case "screen":
        try {
          localScreenShare.shareStream
            ? await localScreenShare.stopScreenShare()
            : await localScreenShare.startScreenShare();
        } catch (error) {}
        break;
      case "record":
        try {
          props.local.isRecording
            ? await stopRecording()
            : await startRecording();
        } catch (error) {}
        break;
      case "muteAll":
        try {
          if (isMutedAll) {
            await props.room.updateRoomControls({
              type: "allowProduce",
              value: true,
            });
            setIsMutedAll(false);
          } else {
            await props.muteEveryone();
            setIsMutedAll(true);
          }
        } catch (error) {}
        break;

      default:
        break;
    }
  }

  function handleLeaveRoom() {
    props.leaveRoom();
    router.push("/");
  }

  const controlsBtnStyle = {
    bg: "rgba(0,0,0,0.25)",
    _hover: {
      bg: "rgba(0,0,0,0.71)",
    },
    backdropFilter: "blur(10px)",
    rounded: "full",
    color: "white",
    fontSize: "20px",
    p: 3,
    h: "auto",
    isDisabled: isIdle,
  };
  async function startRecording() {
    await props.local.onStartRecord?.();
  }
  async function stopRecording() {
    await props.local.onStopRecord?.();
  }
  function handleEndMeeting() {
    props.closeRoom();
    router.push("/");
  }
  return (
    <>
      {" "}
      <HStack
        pos={"absolute"}
        bottom={5}
        left={"50%"}
        transform={"auto"}
        translateX={"-50%"}
        gap={3}
      >
        <IconButton
          aria-label={`${localAudio.isAudioOn ? "disable" : "enable"} mic`}
          {...controlsBtnStyle}
          onClick={() => handleControls("audio")}
        >
          {localAudio.isAudioOn ? <FiMic /> : <FiMicOff />}
          {/* <FiMic /> */}
          {/* <FiMicOff /> */}
        </IconButton>
        <IconButton
          {...controlsBtnStyle}
          aria-label={`${localVideo.isVideoOn ? "disable" : "enable"} video`}
          onClick={() => handleControls("video")}
        >
          {localVideo.isVideoOn ? <FiVideo /> : <FiVideoOff />}
          {/* <FiVideoOff /> */}
        </IconButton>
        <IconButton
          {...controlsBtnStyle}
          aria-label={`${
            localScreenShare.shareStream ? "stop" : "start"
          } screen share`}
          onClick={() => handleControls("screen")}
        >
          {localScreenShare.shareStream ? (
            <LuScreenShareOff />
          ) : (
            <LuScreenShare />
          )}
          {/* <LuScreenShare /> */}
          {/* <LuScreenShareOff /> */}
        </IconButton>
        {isHost && (
          <IconButton
            onClick={() => handleControls("record")}
            {...controlsBtnStyle}
            aria-label={`${
              props.local.isRecording ? "stop" : "start"
            } recording`}
          >
            {props.local.isRecording ? (
              <BsStopCircle color="red" />
            ) : (
              <BsRecordCircle />
            )}
          </IconButton>
        )}

        <Dialog
          role={props.local.role}
          onEnd={handleEndMeeting}
          onLeave={handleLeaveRoom}
        />
      </HStack>
    </>
  );
};
