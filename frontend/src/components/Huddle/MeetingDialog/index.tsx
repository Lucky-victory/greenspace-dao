import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure,
  useColorModeValue
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiPhone } from "react-icons/fi";

export default function Dialog({
  onLeave,
  onEnd,
  role
}: {
  role: string | null;
  onLeave: () => void;
  onEnd: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const isHost = role === "host";

  const bgColor = useColorModeValue("red.500", "red.600");
  const hoverBgColor = useColorModeValue("red.600", "red.700");
  const textColor = useColorModeValue("white", "gray.100");
  const dialogBgColor = useColorModeValue("white", "gray.800");
  const dialogTextColor = useColorModeValue("gray.800", "white");

  function handleLeave() {
    onLeave?.();
    onClose();
  }
  function handleEnd() {
    onEnd?.();
    onClose();
  }
  return (
    <>
      <IconButton
        w={"80px"}
        h={"80px"}
        aria-label="Leave meeting"
        colorScheme="red"
        rounded={"full"}
        color={textColor}
        fontSize={"24px"}
        bg={bgColor}
        _hover={{ bg: hoverBgColor }}
        onClick={onOpen}
        boxShadow="lg"
      >
        <FiPhone />
      </IconButton>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg={dialogBgColor} color={dialogTextColor} borderRadius="xl" boxShadow="2xl">
            <AlertDialogHeader fontSize="xl" fontWeight="bold" textAlign="center" pt={6}>
              Confirm Action
            </AlertDialogHeader>

            <AlertDialogBody fontSize="lg" textAlign="center" py={4}>
              Are you sure you want to {isHost ? "leave or end" : "leave"} the meeting?
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center" pb={6}>
              {isHost ? (
                <>
                  <Button
                    colorScheme="gray"
                    variant="outline"
                    ref={cancelRef}
                    onClick={() => handleLeave()}
                    borderRadius="full"
                    mr={3}
                  >
                    Leave meeting
                  </Button>
                  <Button colorScheme="red" onClick={() => handleEnd()} borderRadius="full">
                    End meeting
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    colorScheme="gray"
                    variant="outline"
                    ref={cancelRef}
                    onClick={onClose}
                    borderRadius="full"
                    mr={3}
                  >
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={() => handleLeave()} borderRadius="full">
                    Leave meeting
                  </Button>
                </>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
