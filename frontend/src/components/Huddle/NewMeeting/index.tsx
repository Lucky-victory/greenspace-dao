import { useInAppAuth } from "src/hooks/common";
import {
  useAddMeetingMutation,
  useCreateRoomMutation,
} from "src/state/services";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
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
  async function handleCreateNewMeeting() {
    try {
      setIsSending(true);

      //const response = await createRoom({ title: meetingTitle }).unwrap();

      const response = await axios.post<{
        data: { roomId: string; token: string };
      }>("/api/create-room", {
        title: meetingTitle,
        // userMeta: session.user,
      });
      const data = response.data.data;

      const roomId = data?.roomId;
 

      await addMeeting({
        roomId: roomId as string,
        title: meetingTitle,
        userId: user?.id,
      }).unwrap();

      setIsSending(false);
      router.push(`/meeting/${roomId}`);
    } catch (error) {
      console.log("Error creating room", { error });
    }
  }
  return (
    <Flex flexDir={"column"} gap={4} maxW={400}>
      {/* <Heading>Create A Meeting</Heading> */}
      <FormControl>
        <FormLabel>Meeting Title:</FormLabel>
        <Input
          autoComplete="off"
          py={3}
          isDisabled={isSending}
          colorScheme="gs-yellow"
          _focus={{
            boxShadow: "0 0 0 1px gray",
            borderColor: "gs-yellow.400",
          }}
          onKeyUp={async (e: KeyboardEvent) => {
            if (e.key == "Enter") await handleCreateNewMeeting();
          }}
          placeholder="What's the meeting about?..."
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
        />
      </FormControl>
      <HStack>
        <Button
          rounded={"full"}
          // flex={1}
          gap={2}
          isLoading={isSending}
          onClick={async () => await handleCreateNewMeeting()}
          //   colorScheme="teal"
        >
          {/* <BiVideoPlus size={24} /> */}
          Continue
        </Button>
      </HStack>
    </Flex>
  );
}
