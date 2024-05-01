import { RootState } from "@/state/store";
import {
  Avatar,
  Box,
  Flex,
  GridItem,
  HStack,
  IconButton,
  ResponsiveValue,
  Text,
} from "@chakra-ui/react";
import {
  useRemoteAudio,
  useRemotePeer,
  useRemoteScreenShare,
  useRemoteVideo,
} from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";
import React, { useEffect, useRef, useState } from "react";
import { FiMic, FiMicOff, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { TPeerMetadata } from "@/types";

type Props = {
  peerId: string;
  isPinned: false;
  activePeers: {
    activePeerIds: string[];
    dominantSpeakerId: string;
    updateSize: (size: number) => void;
  };
};

const RemotePeer = ({ peerId, activePeers, isPinned }: Props) => {
  const remotePeer = useRemotePeer<TPeerMetadata>({ peerId });
  const { stream: videoStream, state } = useRemoteVideo({ peerId });
  const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });

  const { videoStream: screenShareVideo, audioStream: screenAudio } =
    useRemoteScreenShare({ peerId });
  // const vidRef = useRef<HTMLVideoElement>(null);
  // const audioRef = useRef<HTMLAudioElement>(null);
  // const screenVideoRef = useRef<HTMLVideoElement>(null);
  // const screenAudioRef = useRef<HTMLAudioElement>(null);
  const { activePeerIds = [], dominantSpeakerId = "" } = activePeers;
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const participantsCardStyle = {
    // overflow: "hidden",
    minW: { lg: 250, base: 240 },
    flex: 1,
    h: "full",
    w: "full",
    // flexShrink: 0,
    maxH: { lg: 200, base: 300 },
    bg: "gray.800",
    rounded: "10px",
    pos: "relative" as ResponsiveValue<"relative">,
    // maxW: 300,
    transition: "ease-in-out",
    transitionProperty: "boxShadow",
  };
  useEffect(() => {
    if (
      (activePeerIds?.includes(peerId) || dominantSpeakerId == peerId) &&
      audioStream
    ) {
      setIsSpeaking(true);
    } else {
      setIsSpeaking(false);
    }
    // console.log("from remote", { isSpeaking, activePeers });
  }, [dominantSpeakerId, activePeerIds, peerId, audioStream]);

  return (
    <Box
      {...participantsCardStyle}
      maxW={{ base: 300, lg: "auto" }}
      boxShadow={isSpeaking ? "0 0 0 2px yellow" : "none"}
    >
      <HStack
        top={1}
        // right={2}
        justify={"space-between"}
        zIndex={10}
        px={2}
        pos={"absolute"}
        w={"full"}
      >
        {remotePeer.metadata && (
          <Text
            as={"span"}
            fontSize={"14px"}
            px={2}
            rounded={"full"}
            color={"white"}
            bg={"rgba(0,0,0,0.4)"}
            backdropFilter={"auto"}
            backdropBlur={"10px"}
          >
            {remotePeer.metadata?.displayName}
          </Text>
        )}
        <IconButton
          aria-label={audioStream ? "mic is on" : "mic is off"}
          bg={"rgba(0,0,0,0.4)"}
          _hover={{
            bg: "rgba(0,0,0,0.71)",
          }}
          backdropBlur={"10px"}
          rounded={"full"}
          color={"white"}
          pointerEvents={"none"}
          fontSize={"14px"}
          p={1}
          w={"auto"}
          h={"auto"}
        >
          {audioStream ? <FiMic /> : <FiMicOff />}
        </IconButton>
      </HStack>
      {!videoStream && !screenShareVideo && (
        <Flex h={"full"} justify={"center"} align={"center"}>
          <Avatar
            name={remotePeer.metadata?.displayName}
            icon={<FiUser />}
            fontSize={"40px"}
            size={"lg"}
            // src={remotePeer.metadata?.avatarUrl}
            bg={!remotePeer.metadata?.displayName ? "gray.400" : undefined}
          />
        </Flex>
      )}
      {videoStream && (
        <Box
          // border={"5px solid green"}
          // boxShadow={isSpeaking ? "0 0 0 2px blue" : "none"}
          stream={videoStream}
          as={Video}
          muted
          autoPlay
          // ref={vidRef}
          h={"full"}
          w={"full"}
          left={0}
          rounded={"inherit"}
          // aspectRatio={"16:9"}
          objectFit={"contain"}
          top={0}
          pos={"absolute"}
        ></Box>
      )}
      {screenShareVideo && (
        <Box
          muted
          autoPlay
          stream={screenShareVideo}
          as={Video}
          // ref={screenVideoRef}
          h={"full"}
          w={"full"}
          left={0}
          // aspectRatio={"16:9"}
          objectFit={"contain"}
          top={0}
          pos={"absolute"}
        ></Box>
      )}
      <Audio stream={audioStream as MediaStream} autoPlay></Audio>
      {screenAudio && (
        <Audio stream={audioStream as MediaStream} autoPlay></Audio>
      )}
    </Box>
  );
};

export default React.memo(RemotePeer);
