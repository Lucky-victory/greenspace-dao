import { useInAppAuth } from "src/hooks/common";
import { useAddMeetingMutation, useCreateRoomMutation } from "src/state/services";

import { Button, Flex, FormControl, FormLabel, HStack, Input, useColorModeValue, Box } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { KeyboardEvent, useState } from "react";

export default function NewMeeting() {
  const router = useRouter();
  const { user } = useInAppAuth();
  const [meetingTitle, setMeetingTitle] = useState("Health discussions");
  const [isSending, setIsSending] = useState(false);

  const [createRoom, { isLoading, isSuccess }] = useCreateRoomMutation();

  const [addMeeting] = useAddMeetingMutation();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBgColor = useColorModeValue("gray.50", "gray.700");
  const buttonBgColor = useColorModeValue("blue.500", "blue.200");
  const buttonTextColor = useColorModeValue("white", "gray.800");

  async function handleCreateNewMeeting() {
    try {
      setIsSending(true);

      const response = await axios.post<{
        data: { roomId: string; token: string };
      }>("/api/create-room", {
        title: meetingTitle
      });
      const data = response.data.data;

      const roomId = data?.roomId;

      await addMeeting({
        roomId: roomId as string,
        title: meetingTitle,
        userId: user?.id
      }).unwrap();

      setIsSending(false);
      router.push(`/meeting/${roomId}`);
    } catch (error) {
      console.log("Error creating room", { error });
    }
  }

  return (
    <Box bg={bgColor} borderRadius="xl" borderWidth="1px" borderColor={borderColor} p={6} boxShadow="md">
      <Flex flexDir="column" gap={6} maxW={400}>
        <FormControl>
          <FormLabel fontWeight="bold">Meeting Title</FormLabel>
          <Input
            autoComplete="off"
            py={3}
            isDisabled={isSending}
            bg={inputBgColor}
            borderRadius="md"
            _focus={{
              boxShadow: "0 0 0 1px blue.400",
              borderColor: "blue.400"
            }}
            onKeyUp={async (e: KeyboardEvent) => {
              if (e.key == "Enter") await handleCreateNewMeeting();
            }}
            placeholder="What's the meeting about?..."
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
          />
        </FormControl>
        <Button
          isLoading={isSending}
          onClick={async () => await handleCreateNewMeeting()}
          bg={buttonBgColor}
          color={buttonTextColor}
          _hover={{
            bg: useColorModeValue("blue.600", "blue.300")
          }}
          borderRadius="full"
          py={3}
          fontWeight="bold"
        >
          Continue
        </Button>
      </Flex>
    </Box>
  );
}
