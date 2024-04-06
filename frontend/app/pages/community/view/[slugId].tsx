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
import PageWrapper from "@/components/PageWrapper";
import { useActiveTab } from "@/hooks";
import { generateUsername } from "@/utils";
import { Link } from "@chakra-ui/next-js";

export default function CommunityViewPage() {
  const [activeTab, setActiveTab] = useActiveTab("tab");
  const tabBtnStyles = {
    textDecor: "none!important",
    py: 2,
    px: 6,
    rounded: "full",
    fontWeight: "normal",
    _hover: {
      bg: "gray.700",
    },
  };
  const members = [
    {
      fullName: "Mike Uche",
      avatar: "https://randomuser.me/api/portraits/men/53.jpg",
      username: "GH_1341331684",
    },
    {
      fullName: "Olivia Dan",
      avatar: "https://randomuser.me/api/portraits/women/36.jpg",
      username: "GH_1931331334",
    },
    {
      fullName: "Chinenye Johnson",
      avatar: "https://randomuser.me/api/portraits/women/30.jpg",
      username: "GH_1931331684",
    },
  ];

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
    // if (activeTab === "") setActiveTab("about");
    const isActive = tab.url === activeTab;
    return (
      <ListItem fontSize={"18px"} key={tab.name}>
        <Button
          onClick={() => setActiveTab(tab.url)}
          variant={"unstyled"}
          {...tabBtnStyles}
          {...(isActive && {
            fontWeight: 500,
            color: "gs-yellow.300",
            bg: "gs-gray.800",
          })}
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
          <Box flex={1} px={4} borderX={"1px"} borderColor={"gray.600"}>
            info area
          </Box>
          <Box px={5} hideBelow={"lg"}>
            <Box bg={"gray.900"} borderRadius={"15px"} minW={250}>
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
                {members?.length > 0 &&
                  members.map((member, i) => {
                    return (
                      <ListItem key={"member" + i}>
                        <HStack gap={4}>
                          <Avatar size={"sm"} src={member?.avatar} />{" "}
                          <Stack>
                            <Link
                              href={"/user/" + member?.username}
                              textDecor={"none!important"}
                            >
                              <Text fontWeight={500}>{member?.fullName}</Text>
                            </Link>
                          </Stack>
                        </HStack>
                      </ListItem>
                    );
                  })}
              </Stack>
            </Box>
          </Box>
        </Flex>
      </Box>
    </PageWrapper>
  );
}
