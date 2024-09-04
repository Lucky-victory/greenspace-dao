import { RootState } from "src/state/store";
import {
  Avatar,
  Box,
  Flex,
  GridItem,
  HStack,
  IconButton,
  ResponsiveValue,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useRemoteAudio, useRemotePeer, useRemoteScreenShare, useRemoteVideo } from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";
import React, { useEffect, useRef, useState } from "react";
import { FiMic, FiMicOff, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { TPeerMetadata } from "src/types";

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

  const { videoStream: screenShareVideo, audioStream: screenAudio } = useRemoteScreenShare({ peerId });

  const { activePeerIds = [], dominantSpeakerId = "" } = activePeers;
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const bgColor = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const lightBgColor = useColorModeValue("rgba(255,255,255,0.8)", "rgba(0,0,0,0.6)");
  const hoverBgColor = useColorModeValue("rgba(255,255,255,0.9)", "rgba(0,0,0,0.8)");

  const participantsCardStyle = {
    minW: { lg: 250, base: 240 },
    flex: 1,
    h: "full",
    w: "full",
    maxH: { lg: 200, base: 300 },
    bg: bgColor,
    rounded: "xl",
    pos: "relative" as ResponsiveValue<"relative">,
    transition: "all 0.3s ease-in-out",
    boxShadow: "lg",
    border: "1px solid",
    borderColor: borderColor
  };

  useEffect(() => {
    if ((activePeerIds?.includes(peerId) || dominantSpeakerId == peerId) && audioStream) {
      setIsSpeaking(true);
    } else {
      setIsSpeaking(false);
    }
  }, [dominantSpeakerId, activePeerIds, peerId, audioStream]);

  return (
    <Box {...participantsCardStyle} maxW={{ base: 300, lg: "auto" }} boxShadow={isSpeaking ? "0 0 0 2px yellow" : "lg"}>
      <HStack top={2} justify={"space-between"} zIndex={10} px={3} pos={"absolute"} w={"full"}>
        {remotePeer.metadata && (
          <Text
            as={"span"}
            fontSize={"14px"}
            px={3}
            py={1}
            rounded={"full"}
            color={textColor}
            bg={lightBgColor}
            backdropFilter={"auto"}
            backdropBlur={"10px"}
          >
            {remotePeer.metadata?.displayName}
          </Text>
        )}
        <IconButton
          aria-label={audioStream ? "mic is on" : "mic is off"}
          bg={lightBgColor}
          _hover={{
            bg: hoverBgColor
          }}
          backdropFilter={"auto"}
          backdropBlur={"10px"}
          rounded={"full"}
          color={textColor}
          pointerEvents={"none"}
          fontSize={"16px"}
          p={2}
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
            size={"xl"}
            bg={!remotePeer.metadata?.displayName ? "gray.400" : undefined}
          />
        </Flex>
      )}
      {videoStream && (
        <Box
          stream={videoStream}
          as={Video}
          muted
          autoPlay
          h={"full"}
          w={"full"}
          left={0}
          rounded={"inherit"}
          objectFit={"cover"}
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
          h={"full"}
          w={"full"}
          left={0}
          objectFit={"contain"}
          top={0}
          pos={"absolute"}
        ></Box>
      )}
      <Audio stream={audioStream as MediaStream} autoPlay></Audio>
      {screenAudio && <Audio stream={audioStream as MediaStream} autoPlay></Audio>}
    </Box>
  );
};
export default React.memo(RemotePeer);
