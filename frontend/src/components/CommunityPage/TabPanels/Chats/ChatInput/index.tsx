import { useFormik } from "formik";
import { HStack, Input, Button } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { FormEventHandler, FormEvent } from "react";
import { USER_SESSION } from "src/state/types";
import { User } from "@privy-io/react-auth";
export default function CommunityChatInput({
  spaceIdOrId,
  user,
}: {
  user: User | null;
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
        body: JSON.stringify({ message, userId: user?.id }),
      });
    } catch (error) {}
  }

  return (
    <HStack
      bg={"black"}
      px={0}
      py={3}
      as={"form"}
      onSubmit={handleSubmit}
      pos={"sticky"}
      bottom={"0"}
      // left={0}
      w={"full"}
    >
      <Input
        w={"full"}
        py={"12px"}
        h={"auto"}
        _focus={{
          boxShadow: "0 0 0 1px transparent",
          borderColor: "gs-yellow.400",
        }}
        autoComplete="off"
        name="message"
        fontSize={"15px"}
        rounded={"full"}
        value={messageForm.values.message}
        placeholder="Type a message..."
        onChange={messageForm.handleChange}
      />
      <Button
        pos={"absolute"}
        right={3}
        size={"sm"}
        zIndex={4}
        rounded={"full"}
        minW={16}
        colorScheme="gs-yellow"
        isDisabled={messageForm.values.message === ""}
      >
        <FiSend />
      </Button>
    </HStack>
  );
}
