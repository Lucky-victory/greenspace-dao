import { Button, Flex, FormControl, FormLabel, HStack, Input, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { KeyboardEvent, useState } from "react";

export default function JoinMeeting() {
  const router = useRouter();

  const [roomId, setRoomId] = useState("");
  const [isSending, setIsSending] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const focusBorderColor = useColorModeValue("gs-yellow.400", "gs-yellow.600");

  function handleJoinMeeting() {
    setIsSending(true);

    setTimeout(() => {
      router.push(`/meet/${roomId}`);
      setIsSending(false);
    }, 1500);
  }

  return (
    <Flex flexDir={"column"} gap={6} maxW={400} bg={bgColor} p={8} borderRadius="xl" boxShadow="lg">
      <FormControl>
        <FormLabel color={textColor}>Enter meeting ID:</FormLabel>
        <Input
          autoComplete="off"
          py={3}
          h={"auto"}
          colorScheme="gs-yellow"
          isDisabled={isSending}
          borderRadius="md"
          borderColor={borderColor}
          color={textColor}
          _focus={{
            boxShadow: "0 0 0 1px gray",
            borderColor: focusBorderColor
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
          w="full"
          gap={2}
          isLoading={isSending}
          onClick={() => handleJoinMeeting()}
          colorScheme="gs-yellow"
          _hover={{ opacity: 0.8 }}
          transition="all 0.2s"
        >
          Continue
        </Button>
      </HStack>
    </Flex>
  );
}
