import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { LoginButton } from "../Auth/LoginButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export const LoginModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalOverlay />
        <ModalHeader>
          <Heading>Login</Heading>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Stack>
            <LoginButton
              text="Login as User"
              type={"member"}
              styleProps={{
                size: "lg",
                rounded: "full",
                variant: "outline",
                colorScheme: "gs-yellow",
              }}
            />
            <LoginButton
              text="Login as Nutritionist"
              type="nutritionist"
              styleProps={{
                size: "lg",
                rounded: "full",
                colorScheme: "gs-gray",
              }}
            />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
