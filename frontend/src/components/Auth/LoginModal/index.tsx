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
import { LoginButton } from "../LoginButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export const LoginModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent py={6} rounded={"30px"} alignSelf={"center"}>
        <ModalHeader>
          <Heading size={'md'}>Login</Heading>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Stack gap={4}>
            <LoginButton
              text="Login as User"
              type={"member"}
              styleProps={{
                size: "lg",
                rounded: "full",

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
