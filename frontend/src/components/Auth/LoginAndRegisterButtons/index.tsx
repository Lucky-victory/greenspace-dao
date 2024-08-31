import { Button, HStack, useDisclosure } from "@chakra-ui/react";
import { LoginButton } from "../LoginButton";
import { RegisterButton } from "../RegisterButton";
import { LoginModal } from "src/components/Auth/LoginModal";

export const LoginAndRegisterButtons = ({ openModal }: { openModal: () => void }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  function handleRegisterClick() {
    openModal?.();
  }
  function handleLoginClick() {
    onOpen();
  }
  return (
    <HStack gap={3}>
      <Button rounded={"full"} variant={"ghost"} onClick={handleLoginClick}>
        Sign In
      </Button>
      <LoginModal onClose={onClose} isOpen={isOpen} />
      <Button rounded={"full"} colorScheme="gs-yellow" fontWeight="bold" onClick={handleRegisterClick}>
        Join Now
      </Button>
    </HStack>
  );
};
