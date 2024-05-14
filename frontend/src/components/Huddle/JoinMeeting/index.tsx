import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { KeyboardEvent, useState } from "react";

export default function JoinMeeting() {
  const router = useRouter();

  const [roomId, setRoomId] = useState("");
  const [isSending, setIsSending] = useState(false);

  function handleJoinMeeting() {
    setIsSending(true);

    setTimeout(() => {
      router.push(`/meet/${roomId}`);
      setIsSending(false);
    }, 1500);
  }
  return (
    <Flex flexDir={"column"} gap={4} maxW={400}>
      <FormControl>
        <FormLabel>Enter meeting ID:</FormLabel>
        <Input
          autoComplete="off"
          py={3}
          h={"auto"}
          colorScheme="gs-yellow"
          isDisabled={isSending}
          _focus={{
            boxShadow: "0 0 0 1px gray",
            borderColor: "gs-yellow.400",
          }}
          onKeyUp={(e: KeyboardEvent) => {
            if (e.key == "Enter") handleJoinMeeting();
          }}
          placeholder="xyz-abcd-yxz"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </FormControl>
      <HStack>
        <Button
          rounded={"full"}
          // flex={1}
          gap={2}
          isLoading={isSending}
          onClick={() => handleJoinMeeting()}
          // colorScheme="teal"
        >
          Continue
        </Button>
      </HStack>
    </Flex>
  );
}
