import { Box, HStack, IconButton, Input, useColorModeValue } from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { FiSend } from "react-icons/fi";

export default function ChatInput({
  sendData
}: {
  sendData: (data: { to: string[] | "*"; payload: string; label?: string }) => Promise<void>;
}) {
  const [text, setText] = useState<string>("");
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const buttonColorScheme = useColorModeValue("blue", "purple");

  function handleInputChange(evt: ChangeEvent<HTMLInputElement>) {
    setText(evt.target.value);
  }

  const sendMessage = () => {
    sendData({
      to: "*",
      payload: text,
      label: "chat"
    });
    setText("");
  };

  function handleInputKeyUp(evt: KeyboardEvent<HTMLInputElement>): void {
    if (evt.key === "Enter" && !evt.shiftKey) {
      sendMessage();
    }
  }

  return (
    <Box px={4} py={4}>
      <HStack p={3} bg={bgColor} rounded="xl" borderWidth={1} borderColor={borderColor} spacing={3}>
        <Input
          name="message"
          value={text}
          autoComplete="off"
          onKeyUp={handleInputKeyUp}
          onChange={handleInputChange}
          _focus={{ boxShadow: `0 0 0 1px ${borderColor}`, borderColor: buttonColorScheme }}
          placeholder="Type a message..."
          fontWeight={500}
          bg={inputBgColor}
          rounded="lg"
        />
        <IconButton
          isDisabled={text === ""}
          onClick={sendMessage}
          rounded="lg"
          colorScheme={buttonColorScheme}
          aria-label="send message"
          icon={<FiSend />}
        />
      </HStack>
    </Box>
  );
}
