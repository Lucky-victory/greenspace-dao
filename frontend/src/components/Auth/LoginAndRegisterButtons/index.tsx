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
      <Button rounded={"full"} colorScheme="gs-yellow" variant={"outline"} onClick={handleLoginClick}>
        Log-In
      </Button>
      <LoginModal onClose={onClose} isOpen={isOpen} />
      <RegisterButton onClick={handleRegisterClick} />
    </HStack>
  );
};
