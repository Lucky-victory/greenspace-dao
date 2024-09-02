import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  List,
  ListItem,
  Text,
  useBreakpoint,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import PageWrapper from "src/components/PageWrapper";
import { useActiveTab, useInAppAuth } from "src/hooks/common";
import { FiGlobe, FiLock } from "react-icons/fi";
import { useEffect, useState } from "react";
import TabPanels from "src/components/CommunityPage/TabPanels";
import { useRouter } from "next/router";
import Head from "next/head";
import PageLoader from "src/components/PageLoader";
import { useGetCommunityQuery } from "src/state/services";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Members from "src/components/CommunityPage/TabPanels/Members";
import { TabHeading } from "src/components/CommunityPage/TabHeading";
import { BsChevronBarLeft, BsChevronLeft } from "react-icons/bs";
import { Link } from "@chakra-ui/next-js";
import { replaceCloudflareIpfs } from "src/utils";

const tabsObj = [
  {
    name: "About",
    url: ""
  },
  {
    name: "Challenges",
    url: "challenges"
  },
  {
    name: "Events",
    url: "events"
  },
  {
    name: "Chats",
    url: "chats"
  }
];
export default function CommunityViewPage({
  slugId: slugIdFromServer
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const activeBgColor = useColorModeValue("gs-gray.100", "gs-gray.800");
  const bannerBgColor = useColorModeValue("gs-gray.100", "gs-gray.600");
  const buttonBgColor = useColorModeValue("whiteAlpha.600", "blackAlpha.600");
  const buttonHoverBgColor = useColorModeValue("whiteAlpha.700", "blackAlpha.700");
  const visibilityBgColor = useColorModeValue("rgba(255,255,255,0.45)", "rgba(0,0,0,0.45)");
  const borderTopColor = useColorModeValue("gray.200", "gray.900");
  const navBgColor = useColorModeValue("gray.50", "gray.900");
  const imageBgColor = useColorModeValue("gray.100", "gray.700");

  const slugId = slugIdFromServer || (router.query.slugId as string);
  const { connect, user, isLoggedIn } = useInAppAuth();
  const [activeTab, setActiveTab] = useActiveTab("tab");
  const breakpoint = useBreakpoint();
  const [tabs, setTabs] = useState(tabsObj);
  const smallerBreakPoints = ["md", "base", "sm"];

  const { data: communityData, isLoading, isFetching } = useGetCommunityQuery({ spaceIdOrId: slugId });
  const community = communityData?.data;
  useEffect(() => {
    if (smallerBreakPoints.includes(breakpoint)) {
      setTabs((prev) => tabs.filter((tab) => tab.name !== "Members"));

      setTabs((prev) => [...prev, { name: "Members", url: "members" }]);
    } else {
      setTabs((prev) => tabs.filter((tab) => tab.name !== "Members"));
      if (activeTab === "members") setActiveTab("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpoint]);

  const tabBtnStyles = {
    textDecor: "none!important",
    py: 2,
    px: 5,
    rounded: "full",
    fontWeight: "normal",
    _hover: {
      bg: hoverBgColor
    }
  };

  const activeColor = useColorModeValue("gs-yellow.600", "gs-yellow.300");
  const activeBg = useColorModeValue("gs-gray.100", "gs-gray.700");
  const tabButtons = tabs.map((tab) => {
    const isActive = tab.url === activeTab;
    return (
      <ListItem fontSize={"18px"} key={tab.name}>
        <Button
          onClick={() => setActiveTab(tab.url)}
          variant={"unstyled"}
          {...tabBtnStyles}
          {...(isActive && {
            fontWeight: 500,
            color: activeColor,
            bg: activeBg
          })}
        >
          {tab.name}
        </Button>
      </ListItem>
    );
  });
  return (
    <PageLoader isLoading={isLoading || isFetching} text="">
      <Head>
        <title>{community?.name}</title>
        <meta name="description" content={community?.description} />
        <meta property="og:title" content={community?.name} />
        <meta property="og:description" content={community?.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={community?.coverImage} />
        <meta property="og:url" content="https://greenspacedao.xyz" />
        <meta property="og:site_name" content="GreenspaceDAO" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_GB" />
      </Head>

      {community && (
        <PageWrapper
          props={{
            h: "var(--chakra-vh,100vh)",
            py: { base: 0, lg: 5 }
          }}
        >
          {/* BANNER AREA */}
          <Box>
            <Box h={{ lg: 200, base: 150 }} pos={"relative"} bg={bannerBgColor} overflow={"hidden"} rounded={"lg"}>
              <Button
                gap={2}
                bg={buttonBgColor}
                variant={"ghost"}
                pos={"absolute"}
                top={3}
                left={3}
                colorScheme={colorMode === "light" ? "gray" : "white"}
                zIndex={5}
                _hover={{ bg: buttonHoverBgColor }}
                onClick={() => router.back()}
              >
                <BsChevronLeft /> <Text> Back</Text>
              </Button>
              <Image
                alt="banner"
                src={replaceCloudflareIpfs(community?.coverImage!) || "/assets/community-default-bg.png"}
                h={"full"}
                w={"full"}
                objectFit={"cover"}
                objectPosition={"top"}
              />
              <Box pos={"absolute"} right={0} bottom={0} p={3}>
                <HStack rounded={"full"} bg={visibilityBgColor} px={3} py={1}>
                  <>{community?.visibility === "private" ? <FiLock /> : <FiGlobe />}</>
                  <Text fontSize={"10px"} textTransform={"uppercase"} as={"span"}>
                    {community?.visibility}
                  </Text>
                </HStack>
              </Box>
            </Box>
            <Flex
              mb={10}
              flexDir={{ lg: "row", base: "column" }}
              gap={5}
              justify={{ lg: "flex-start", base: "center" }}
              align={"center"}
              pl={5}
              mt={{ lg: -14, base: "-50px" }}
              pos={"relative"}
            >
              <Box
                rounded={"full"}
                w={{ lg: 130, base: 100 }}
                h={{ lg: 130, base: 100 }}
                boxShadow={`0 0 0 6px ${bgColor}`}
                bg={imageBgColor}
                overflow={"hidden"}
              >
                <Image
                  alt=""
                  src={replaceCloudflareIpfs(community?.displayImage!) || "/assets/community-dp.png"}
                  h={"full"}
                  w={"full"}
                  objectFit={"cover"}
                />
              </Box>
              <Heading as={"h1"} size={"lg"} textAlign={"center"} mt={{ lg: 14, base: 0 }} color={textColor}>
                {community?.name}
              </Heading>
            </Flex>
          </Box>
          <Flex
            borderTop={"4px"}
            borderTopColor={borderTopColor}
            direction={{ lg: "row", base: "column" }}
            flex={1}
            maxH={"full"}
            h={"full"}
          >
            <Flex
              borderBottom={{ base: "2px", lg: "none" }}
              borderBottomColor={borderColor}
              pb={2}
              pt={{ base: 2 }}
              minW={200}
              as={List}
              direction={{ lg: "column", base: "row" }}
              overflowX={"auto"}
              px={{ base: 2, lg: 4 }}
              gap={{ base: 3, lg: 4 }}
              flexShrink={0}
              zIndex={5}
              pos={"sticky"}
              bg={navBgColor}
              top={0}
              className="is-nav no-scrollbar"
            >
              {tabButtons}
            </Flex>

            <Box flex={1} px={4} borderX={{ lg: "1px" }} borderColor={{ lg: borderColor }}>
              <TabPanels activeTab={activeTab} spaceIdOrId={slugId} description={community?.description!} />
            </Box>
            <Box px={4} hideBelow={"lg"} pos={"sticky"} top={0} bg={bgColor}>
              <Box borderRadius={"10px"} minW={250}>
                <TabHeading title="Members" size="md" />
                <Members showHeading={false} spaceIdOrId={slugId} />
              </Box>
            </Box>
          </Flex>
        </PageWrapper>
      )}
    </PageLoader>
  );
}
export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { slugId } = query;

  // Pass the pathname as props
  return {
    props: {
      slugId: slugId as string
    }
  };
}
