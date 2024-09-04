import { Box, Button, HStack, IconButton, Text, useColorModeValue } from "@chakra-ui/react";

import { Room } from "@huddle01/web-core";
import { FiCheck, FiSlash, FiUsers } from "react-icons/fi";
import isEmpty from "just-is-empty";
import { useEffect, useState } from "react";
import { TPeerMetadata } from "src/types";

export default function NewPeerRequest({ room, peerId }: { room: Room; peerId?: string }) {
  const [lastLobbyPeer, setLastLobbyPeer] = useState<null | {
    name: string;
    id: string;
  }>();

  function acceptPeer(peerId: string) {
    room.admitPeer(peerId);
  }

  function denyPeer(peerId: string) {
    room.denyPeer(peerId);
  }

  function getLobbyPeerMeta(peerId: string) {
    return room.getLobbyPeerMetadata<TPeerMetadata>(peerId);
  }

  function getLastPeer() {
    const lobbyPeerId = room.lobbyPeerIds[room.lobbyPeerIds.length - 1];
    if (!isEmpty(lobbyPeerId)) {
      return {
        name: getLobbyPeerMeta(lobbyPeerId).metadata?.displayName,
        id: lobbyPeerId
      };
    }
  }

  // Color mode values
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const buttonHoverBg = useColorModeValue("gray.200", "gray.600");

  return (
    <Box>
      <HStack
        key={peerId}
        gap={4}
        bg={bgColor}
        px={"16px"}
        py={"12px"}
        rounded={"xl"}
        shadow="md"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
      >
        <Text as={"span"} color={textColor}>
          <Text as={"span"} fontWeight={600}>
            {getLastPeer()?.name}
          </Text>
          <Text as={"span"}> wants to join</Text>
        </Text>
        <HStack>
          <IconButton
            rounded={"full"}
            size={"md"}
            aria-label="reject"
            colorScheme="red"
            onClick={() => denyPeer(getLastPeer()?.id as string)}
            _hover={{ bg: "red.600" }}
            transition="all 0.2s"
          >
            <FiSlash size={20} />
          </IconButton>
          <IconButton
            onClick={() => acceptPeer(getLastPeer()?.id as string)}
            size={"md"}
            colorScheme="green"
            rounded={"full"}
            aria-label="accept"
            _hover={{ bg: "green.600" }}
            transition="all 0.2s"
          >
            <FiCheck size={22} />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}
