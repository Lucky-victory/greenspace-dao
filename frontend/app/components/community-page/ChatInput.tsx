import { useFormik } from "formik";
import { HStack, Input, Button } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { FormEventHandler, FormEvent } from "react";
import { USER_SESSION } from "@/state/types";
export default function CommunityChatInput({
  spaceIdOrId,
  user,
}: {
  user: USER_SESSION["user"] | null;
  spaceIdOrId: string;
}) {
  /**
   * The function was used in other to stop typescript types warning for chakra
   * @param event
   */
  const handleSubmit: FormEventHandler<HTMLDivElement | HTMLFormElement> = (
    event
  ) => {
    messageForm.handleSubmit(event as FormEvent<HTMLFormElement>);
  };

  const messageForm = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: async (values, formikHelpers) => {
      const { message } = values;

      formikHelpers.setFieldValue("message", "");
      await sendMessage(message);
    },
  });
  async function sendMessage(message: string) {
    try {
      await fetch(`/api/pusher/chat?communityId=${spaceIdOrId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: user?.authId }),
      });
    } catch (error) {}
  }

  return (
    <HStack
      bg={"black"}
      px={2}
      py={3}
      as={"form"}
      onSubmit={handleSubmit}
      pos={"sticky"}
      bottom={"0"}
      // left={0}
      w={"full"}
    >
      <Input
        // rounded={"full"}
        _focus={{
          boxShadow: "0 0 0 1px transparent",
          borderColor: "gs-yellow.400",
        }}
        autoComplete="off"
        name="message"
        value={messageForm.values.message}
        placeholder="Type a message..."
        onChange={messageForm.handleChange}
      />
      <Button
        colorScheme="gs-yellow"
        isDisabled={messageForm.values.message === ""}
      >
        <FiSend />
      </Button>
    </HStack>
  );
}
