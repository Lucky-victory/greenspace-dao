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
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiPhone } from "react-icons/fi";

export default function Dialog({
  onLeave,
  onEnd,
  role,
}: {
  role: string | null;
  onLeave: () => void;
  onEnd: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const isHost = role === "host";
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
        aria-label="Leave meeting"
        colorScheme="red"
        rounded={"full"}
        color={"white"}
        fontSize={"20px"}
        bg={"red.800"}
        onClick={onOpen}
      >
        <FiPhone />
      </IconButton>

      <AlertDialog
        isOpen={isOpen}
        /*@ts-ignore*/
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
            ></AlertDialogHeader>

            <AlertDialogBody>Are you sure?</AlertDialogBody>

            <AlertDialogFooter>
              {isHost && (
                <>
                  <Button
                    colorScheme="red"
                    variant={"ghost"}
                    //@ts-ignore
                    ref={cancelRef}
                    onClick={() => handleLeave()}
                  >
                    Leave meeting
                  </Button>
                  <Button colorScheme="red" onClick={() => handleEnd()} ml={3}>
                    End meeting
                  </Button>
                </>
              )}
              {!isHost && (
                <>
                  <Button
                    variant={"ghost"}
                    colorScheme="gray"
                    //@ts-ignore
                    ref={cancelRef}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleLeave()}
                    ml={3}
                  >
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
