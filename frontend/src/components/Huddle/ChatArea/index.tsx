import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { useDataMessage, useLocalPeer } from "@huddle01/react/hooks";
import { useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FiMessageCircle } from "react-icons/fi";
import { Room } from "@huddle01/web-core";
import { TPeerMetadata } from "src/types";
import ChatInput from "src/components/Huddle/ChatInput";
import Linkify from "linkify-react";

export type TMessage = {
  text: string;
  senderId: string;
  senderName?: string;
  timestamp: number;
};

export const ChatArea = ({ room, onMinimized }: { room: Room; onMinimized: (isMinimized: boolean) => void }) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const { peerId, role, metadata: localPeerMetadata } = useLocalPeer<TPeerMetadata>();
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const chatBgColor = useColorModeValue("gray.100", "gray.700");
  const remoteBgColor = useColorModeValue("gray.200", "gray.600");

  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            text: payload,
            senderId: from,
            senderName: getPeerMetadata(from)?.displayName as string,
            timestamp: new Date().getTime()
          }
        ]);
      }
    }
  });

  function getPeerMetadata(peerId: string) {
    if (isLocalPeer(peerId)) {
      return localPeerMetadata;
    } else {
      return room.remotePeerExists(peerId)?.getMetadata<TPeerMetadata>();
    }
  }

  function isLocalPeer(senderId: string): boolean {
    return peerId === senderId;
  }

  useEffect(() => {
    if (messages.length) {
      scrollToBottomRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [messages.length]);

  function handleChatAreaMinimize() {
    const _isMinimized = !isMinimized;
    setIsMinimized(_isMinimized);
    onMinimized?.(_isMinimized);
  }

  const btnStyles = isMinimized ? { translateY: "0" } : { translateY: "100vh" };

  return (
    <>
      <Button
        colorScheme="gs-green"
        size={{ base: "md", md: "lg" }}
        rounded="full"
        shadow="lg"
        right={4}
        bottom={4}
        zIndex={999}
        onClick={handleChatAreaMinimize}
        {...btnStyles}
        transition="0.5s ease-in-out"
        transform="auto"
        pos="absolute"
        gap={2}
      >
        <FiMessageCircle />
        <Text hideBelow="sm">Live Chat</Text>
      </Button>
      <Box
        zIndex={993}
        border="1px"
        borderColor={borderColor}
        overflow="hidden"
        pos="absolute"
        right={3}
        bottom={2}
        minW="calc(var(--chat-area-width) - 12px)"
        maxW="350px"
        top={2}
        bg={bgColor}
        rounded="2xl"
        transition="0.5s ease-in-out"
        transform="auto"
        boxShadow="lg"
        {...(isMinimized ? { translateX: "200%" } : { translateX: 0 })}
      >
        <Stack h="full" p={2} pb={1}>
          <HStack justify="space-between" roundedTop="xl" px={4} py={3} bg={useColorModeValue("gray.100", "gray.900")}>
            <Heading flex={1} size="sm" color={textColor}>
              Room Chat
            </Heading>
            <IconButton
              onClick={handleChatAreaMinimize}
              variant="ghost"
              zIndex={3}
              rounded="full"
              aria-label="close chat"
              icon={<CgClose />}
            />
          </HStack>
          <Stack
            gap={2}
            flex={1}
            px={2}
            py={3}
            pos="relative"
            maxH={500}
            overflowY="auto"
            bg={chatBgColor}
            rounded="xl"
          >
            {messages.map((message, i) => {
              const isLocal = isLocalPeer(message.senderId);
              const localBgColor = "gs-green.500";
              const bgColor = isLocal ? localBgColor : remoteBgColor;
              return (
                <Stack
                  key={"chat" + i}
                  alignSelf={isLocal ? "flex-end" : "flex-start"}
                  p={2}
                  maxW="280px"
                  bg={bgColor}
                  rounded="2xl"
                  roundedBottomRight={isLocal ? "sm" : "2xl"}
                  roundedBottomLeft={isLocal ? "2xl" : "sm"}
                >
                  <HStack gap={1} align="flex-start" fontSize="xs" justify="space-between">
                    <Text as="span" fontWeight={600} color={isLocal ? "white" : textColor}>
                      {message?.senderName} {isLocal && "(You)"}
                    </Text>
                    <Text as="span" flexShrink={0} color={isLocal ? "white" : textColor}>
                      {/* {formatMessageTime(message.timestamp)} */}
                    </Text>
                  </HStack>
                  <Text color={isLocal ? "white" : textColor} fontSize="sm">
                    <Linkify
                      options={{
                        className: "link-in-chat",
                        defaultProtocol: "https",
                        target: "_blank"
                      }}
                    >
                      {message.text}
                    </Linkify>
                  </Text>
                </Stack>
              );
            })}
            <div ref={scrollToBottomRef} />{" "}
          </Stack>
          <ChatInput sendData={sendData} />
        </Stack>
      </Box>
    </>
  );
};
