import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  VStack,
  useClipboard,
  useToast,
  useColorModeValue
} from "@chakra-ui/react";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import NewPeerRequest from "../NewPeerRequest";
import { Room } from "@huddle01/web-core";
import { useLobby } from "@huddle01/react/hooks";
import { useAppDispatch } from "src/state/store";
import { useFormik } from "formik";
import { LuCheck, LuCopy } from "react-icons/lu";
import { FormEvent, useEffect } from "react";
import axios from "axios";

export default function MeetingHeader({
  room,
  meetingTitle,
  isHost
}: {
  room: Room;
  meetingTitle?: string;
  isHost?: boolean;
}) {
  const { onCopy, hasCopied, value, setValue } = useClipboard("");
  const dispatch = useAppDispatch();
  const toast = useToast({
    duration: 3000,
    position: "top",
    title: "Invitation sent successfully",
    status: "success"
  });
  const lobbyPeers = useLobby({
    onLobbyPeersUpdated: (lobbyPeers) => {}
  });
  const formik = useFormik({
    initialValues: {
      email: ""
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post("/api/email", {
          email: values.email,
          link: window.location.href
        });
        toast();
        formik.resetForm();
      } catch (error) {
        toast({
          title: "Something went wrong, please try again",
          status: "error"
        });
      }
    }
  });

  const handleCopy = () => {
    onCopy();
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setValue(window.location.href);
    }
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const buttonBgColor = useColorModeValue("teal.100", "teal.700");
  const buttonHoverBgColor = useColorModeValue("teal.200", "teal.600");
  const popoverBgColor = useColorModeValue("white", "gray.700");
  const inputBgColor = useColorModeValue("gray.100", "gray.600");

  return (
    <HStack justify={"space-between"} gap={5} bg={bgColor} rounded={"xl"} py={4} px={6} shadow="md">
      <Box>
        <Heading size={{ base: "sm", md: "md" }} color={textColor}>
          {meetingTitle}
        </Heading>
      </Box>
      <HStack px={4} gap={5}>
        <Box>
          <Popover>
            <PopoverTrigger>
              <Button
                colorScheme="teal"
                bg={buttonBgColor}
                _hover={{ bg: buttonHoverBgColor }}
                pos={"relative"}
                rounded={"full"}
                gap={3}
                size={"sm"}
                aria-label="invite people"
              >
                <FiUserPlus />
                <Text hideBelow={"md"}>Invite people</Text>
              </Button>
            </PopoverTrigger>

            <PopoverContent bg={popoverBgColor} borderColor="transparent" shadow="lg">
              <PopoverArrow />
              <PopoverCloseButton />

              <PopoverBody py={4} mt={4}>
                <VStack divider={<Divider />} gap={4}>
                  <Button
                    size={"md"}
                    w={"full"}
                    gap={3}
                    colorScheme="teal"
                    variant={"solid"}
                    onClick={() => handleCopy()}
                    rounded={"full"}
                  >
                    {hasCopied ? <LuCheck /> : <LuCopy />} {hasCopied ? "Copied" : "Copy Link"}
                  </Button>
                  <Stack bg={inputBgColor} p={4} w={"full"} rounded={"lg"}>
                    <Stack
                      as="form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                      }}
                    >
                      <FormControl>
                        <FormLabel color={textColor}>Invite by email:</FormLabel>

                        <Input
                          type="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          bg={inputBgColor}
                          _focus={{
                            boxShadow: "0 0 0 1px teal",
                            borderColor: "teal.400"
                          }}
                          placeholder="Enter email"
                          rounded={"full"}
                        />
                      </FormControl>
                      <Button
                        isLoading={formik.isSubmitting}
                        loadingText={"Sending..."}
                        type="submit"
                        colorScheme="teal"
                        rounded={"full"}
                      >
                        Send Invite
                      </Button>
                    </Stack>
                  </Stack>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
        {isHost ? (
          <HStack gap={4}>
            <HStack>
              <FiUsers />
              <Text hideBelow={"md"} fontSize={"13px"} as={"span"} color={textColor}>
                Pending Invites
              </Text>
            </HStack>

            <Badge colorScheme="orange" rounded={"full"} px={2}>
              {lobbyPeers.lobbyPeersIds.length}
            </Badge>
          </HStack>
        ) : (
          <Box></Box>
        )}
        {isHost && <>{lobbyPeers.lobbyPeersIds.length > 0 && <NewPeerRequest room={room} />}</>}
      </HStack>
    </HStack>
  );
}
