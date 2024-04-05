import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import PageWrapper from "@/components/PageWrapper";
import { useActiveTab } from "@/hooks";

export default function CommunityViewPage() {
  const [activeTab, setActiveTab] = useActiveTab("tab");
  const tabBtnStyles = {
    textDecor: "none!important",
    py: 2,
    px: 6,
    rounded: "full",
    // color:"gs-yellow.500",
    _hover: {
      bg: "gray.700",
    },
  };
  const tabs = [
    {
      name: "About",
      url: "",
    },
    {
      name: "Challenges",
      url: "challenges",
    },
    {
      name: "Events",
      url: "events",
    },
    {
      name: "Chats",
      url: "chats",
    },
  ];
  const tabButtons = tabs.map((tab) => {
    const isActive = tab.url === activeTab;
    return (
      <ListItem fontSize={"18px"} key={tab.name}>
        <Button
          onClick={() => setActiveTab(tab.url)}
          variant={"unstyled"}
          {...tabBtnStyles}
          {...(isActive && { color: "gs-yellow.400", bg: "gs-gray.800" })}
        >
          {tab.name}
        </Button>
      </ListItem>
    );
  });
  return (
    <PageWrapper props={{ minH: "var(--chakra-vh,100vh)" }}>
      <Box>
        {/* BANNER AREA */}
        <Box>
          <Box h={{ lg: 220, base: 180 }} pos={"relative"} bg={"gs-gray.600"}>
            <Image
              alt="cover background"
              src="/assets/community.jpg"
              h={"full"}
              w={"full"}
              objectFit={"cover"}
              opacity={0.75}
            />
          </Box>
          <Flex
            mb={10}
            justify={{ lg: "flex-start", base: "center" }}
            pl={5}
            mt={{ lg: -20, base: "-75px" }}
            pos={"relative"}
          >
            <Box
              rounded={"full"}
              w={{ lg: 150, base: 130 }}
              h={{ lg: 150, base: 130 }}
              boxShadow={"0 0 0 4px #8a8f91"}
              bg={"red"}
              overflow={"hidden"}
            >
              <Image
                alt=""
                src="/assets/coaching.jpg"
                h={"full"}
                w={"full"}
                objectFit={"cover"}
              />
            </Box>
          </Flex>
        </Box>
        <Flex>
          <Stack hideBelow={"md"}>
            <Flex as={List} direction={"column"} px={4} gap={4}>
              {[tabButtons]}
            </Flex>
          </Stack>
          <Box flex={1} px={4} borderX={"1px"} borderColor={"gray.400"}>
            info area
          </Box>
          <Box px={5} hideBelow={"lg"}>
            <Box bg={"gray.800"} borderRadius={"15px"}>
              <Heading
                size={"md"}
                fontWeight={500}
                borderBottom={"1px"}
                p={2}
                borderBottomColor={"gray.600"}
              >
                Members
              </Heading>
              <Stack p={4} as={List} divider={<Divider />}>
                <ListItem>
                  <HStack gap={4}>
                    <Avatar size={"sm"} />{" "}
                    <Stack>
                      <Text fontWeight={500}>Mike Uche</Text>
                    </Stack>
                    <Button rounded={"full"} fontWeight={"normal"} size={"xs"}>
                      View profile
                    </Button>
                  </HStack>
                </ListItem>
                <ListItem>
                  <HStack gap={4}>
                    <Avatar size={"sm"} />{" "}
                    <Stack>
                      <Text fontWeight={500}>Olivia Daniel</Text>
                    </Stack>
                    <Button rounded={"full"} fontWeight={"normal"} size={"xs"}>
                      View profile
                    </Button>
                  </HStack>
                </ListItem>
                <ListItem>
                  <HStack gap={4}>
                    <Avatar size={"sm"} />{" "}
                    <Stack>
                      <Text fontWeight={500}>Chinenye Johnson</Text>
                    </Stack>
                    <Button rounded={"full"} fontWeight={"normal"} size={"xs"}>
                      View profile
                    </Button>
                  </HStack>
                </ListItem>
              </Stack>
            </Box>
          </Box>
        </Flex>
      </Box>
    </PageWrapper>
  );
}
