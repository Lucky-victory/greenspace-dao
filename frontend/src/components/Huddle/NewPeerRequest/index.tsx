import { Box, Button, HStack, IconButton, Text } from "@chakra-ui/react";

import { Room } from "@huddle01/web-core";
import { FiCheck, FiSlash, FiUsers } from "react-icons/fi";
import isEmpty from "just-is-empty";
import { useEffect, useState } from "react";
import { TPeerMetadata } from "src/types";
export default function NewPeerRequest({
  room,
  peerId,
}: {
  room: Room;
  peerId?: string;
}) {
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
        id: lobbyPeerId,
      };
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <Box>
      <HStack
        key={peerId}
        gap={4}
        bg={"gray.700"}
        px={"10px"}
        py={"6px"}
        rounded={"full"}
      >
        <Text as={"span"}>
          <Text as={"span"} fontWeight={500}>
            {getLastPeer()?.name}
          </Text>
          <Text as={"span"}> wants to join</Text>
        </Text>
        <HStack>
          <IconButton
            rounded={"full"}
            size={"sm"}
            aria-label="reject"
            colorScheme="red"
            onClick={() => denyPeer(getLastPeer()?.id as string)}
          >
            <FiSlash size={20} />
          </IconButton>
          <IconButton
            onClick={() => acceptPeer(getLastPeer()?.id as string)}
            size={"sm"}
            colorScheme="green"
            rounded={"full"}
            aria-label="accept"
          >
            <FiCheck size={22} />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
}
