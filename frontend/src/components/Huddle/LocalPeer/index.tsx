import { Avatar, Box, Flex, HStack, IconButton, Spinner, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useLocalAudio, useLocalScreenShare, useLocalVideo } from "@huddle01/react/hooks";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsRecordCircle, BsStopCircle } from "react-icons/bs";
import { FiMic, FiMicOff, FiPhone, FiStopCircle, FiUser, FiVideo, FiVideoOff } from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { Room } from "@huddle01/web-core";
import { Video, Audio } from "@huddle01/react/components";
import { RoomStates } from "@huddle01/web-core/types";
import Dialog from "../MeetingDialog";

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
  closeStreamOfLabel: (data: { label: string; peerIds?: string[] | undefined }) => Promise<void>;
}
export default function LocalPeer(props: Props) {
  const isHost = props.local.role === "host";
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

  const bgColor = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");

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
        rounded={"xl"}
        w={"full"}
        h={"full"}
        transition={"ease-in-out"}
        transitionProperty={"boxShadow"}
        boxShadow={isSpeaking ? "0 0 0 3px yellow" : "none"}
        bg={bgColor}
      >
        {props.state === "connected" && (
          <>
            <HStack zIndex={100} pos={"absolute"} w={"full"} justify={"space-between"} p={4}>
              <Box
                rounded={"full"}
                px={4}
                py={2}
                bg={"blackAlpha.500"}
                backdropFilter={"auto"}
                backdropBlur={"10px"}
                color={textColor}
              >
                <Text as={"span"} fontWeight={600}>
                  {props.local?.displayName} (You)
                </Text>
              </Box>
              {isHost && props.local.isRecording && (
                <Flex
                  rounded={"full"}
                  align={"center"}
                  px={4}
                  py={2}
                  gap={2}
                  fontWeight={600}
                  bg={"blackAlpha.500"}
                  backdropFilter={"auto"}
                  backdropBlur={"10px"}
                  color={textColor}
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
                borderColor={borderColor}
                zIndex={3}
                h={"150px"}
                rounded={"xl"}
                pos={"absolute"}
                overflow={"hidden"}
                top={4}
                left={4}
              >
                <Box
                  as={Video}
                  stream={videoStream}
                  muted
                  autoPlay
                  h={"full"}
                  w={"full"}
                  left={0}
                  top={0}
                  objectFit={"cover"}
                  pos={"absolute"}
                ></Box>
              </Box>
            )}
            {!(isVideoOn || shareScreenStream) && (
              <Stack flex={1} align={"center"} justify={"center"} h={"full"}>
                <Avatar
                  name={props?.local?.displayName}
                  size={"2xl"}
                  src={props.local?.metadata?.avatar}
                  icon={<FiUser size={60} />}
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
                  rounded={"xl"}
                  bg={bgColor}
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
                bg={bgColor}
                autoPlay
                h={"full"}
                w={"full"}
                left={0}
                top={0}
                rounded={"xl"}
                objectFit={"contain"}
                pos={"absolute"}
              ></Box>
            )}
          </>
        )}

        {props.state == "connecting" && (
          <Flex gap={5} w={"full"} h={"full"} justify={"center"} align={"center"}>
            <Spinner thickness="4px" speed="0.75s" emptyColor={bgColor} color="gs-yellow.300" size="xl" />
            <Text fontSize={"20px"} color={textColor}>
              Connecting...
            </Text>
          </Flex>
        )}
        {props.state === "connected" && (
          <Controls localVideo={localVideo} {...props} localScreenShare={localScreenShare} localAudio={localAudio} />
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
    enableVideo: (customVideoStream?: MediaStream | undefined) => Promise<MediaStream | undefined>;
    disableVideo: () => Promise<void>;
  };
  localAudio: {
    stream: MediaStream | null;
    track: MediaStreamTrack | null;
    isAudioOn: boolean;
    enableAudio: (customAudioStream?: MediaStream | undefined) => Promise<MediaStream | undefined>;
    disableAudio: () => Promise<void>;
  };
  localScreenShare: {
    shareStream: MediaStream | null;
    startScreenShare: () => Promise<MediaStream | undefined>;
    stopScreenShare: () => Promise<void>;
  };
};
export const Controls = ({ localAudio, localScreenShare, localVideo, ...props }: ControlProps) => {
  const isIdle = props.state === "idle";
  const isHost = props.local.role === "host";

  const [isMutedAll, setIsMutedAll] = useState<boolean>(false);
  const router = useRouter();

  const bgColor = useColorModeValue("whiteAlpha.500", "blackAlpha.500");
  const hoverBgColor = useColorModeValue("whiteAlpha.700", "blackAlpha.700");
  const iconColor = useColorModeValue("gray.800", "white");

  async function handleControls(type: "audio" | "video" | "screen" | "record" | "muteAll") {
    switch (type) {
      case "audio":
        try {
          localAudio.isAudioOn ? await localAudio.disableAudio() : await localAudio.enableAudio();
        } catch (error) {}
        break;
      case "video":
        try {
          localVideo.isVideoOn ? await localVideo.disableVideo() : await localVideo.enableVideo();
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
          props.local.isRecording ? await stopRecording() : await startRecording();
        } catch (error) {}
        break;
      case "muteAll":
        try {
          if (isMutedAll) {
            await props.room.updateRoomControls({
              type: "allowProduce",
              value: true
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
    bg: bgColor,
    _hover: {
      bg: hoverBgColor
    },
    backdropFilter: "blur(10px)",
    rounded: "full",
    color: iconColor,
    fontSize: "24px",
    p: 4,
    h: "auto",
    isDisabled: isIdle
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
      <HStack pos={"absolute"} bottom={6} left={"50%"} transform={"auto"} translateX={"-50%"} gap={4}>
        <IconButton
          aria-label={`${localAudio.isAudioOn ? "disable" : "enable"} mic`}
          {...controlsBtnStyle}
          onClick={() => handleControls("audio")}
        >
          {localAudio.isAudioOn ? <FiMic /> : <FiMicOff />}
        </IconButton>
        <IconButton
          {...controlsBtnStyle}
          aria-label={`${localVideo.isVideoOn ? "disable" : "enable"} video`}
          onClick={() => handleControls("video")}
        >
          {localVideo.isVideoOn ? <FiVideo /> : <FiVideoOff />}
        </IconButton>
        <IconButton
          {...controlsBtnStyle}
          aria-label={`${localScreenShare.shareStream ? "stop" : "start"} screen share`}
          onClick={() => handleControls("screen")}
        >
          {localScreenShare.shareStream ? <LuScreenShareOff /> : <LuScreenShare />}
        </IconButton>
        {isHost && (
          <IconButton
            onClick={() => handleControls("record")}
            {...controlsBtnStyle}
            aria-label={`${props.local.isRecording ? "stop" : "start"} recording`}
          >
            {props.local.isRecording ? <BsStopCircle color="red" /> : <BsRecordCircle />}
          </IconButton>
        )}

        <Dialog role={props.local.role} onEnd={handleEndMeeting} onLeave={handleLeaveRoom} />
      </HStack>
    </>
  );
};
