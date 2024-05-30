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

const tabsObj = [
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
export default function CommunityViewPage({
  slugId: slugIdFromServer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // TODO: Add a 404 redirect when no community is found.
  const router = useRouter();

  const slugId = slugIdFromServer || (router.query.slugId as string);
  const { connect, user, isLoggedIn } = useInAppAuth();
  const [activeTab, setActiveTab] = useActiveTab("tab");
  const breakpoint = useBreakpoint();
  const [tabs, setTabs] = useState(tabsObj);
  const smallerBreakPoints = ["md", "base", "sm"];

  const {
    data: communityData,
    isLoading,
    isFetching,
  } = useGetCommunityQuery({ spaceIdOrId: slugId });
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
      bg: "gray.700",
    },
  };

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
    <PageLoader isLoading={isLoading || isFetching} text="Fetching data...">
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
          bg="gray.800"
          props={{
            h: "var(--chakra-vh,100vh)",
            // maxH: { base: "auto", lg: "800px" },
          }}
        >
          {/* BANNER AREA */}
          <Box>
            <Box h={{ lg: 250, base: 180 }} pos={"relative"} bg={"gs-gray.600"}>
              <Button
                gap={2}
                bg={"blackAlpha.600"}
                variant={"ghost"}
                pos={"absolute"}
                top={3}
                left={3}
                colorScheme="gray"
                zIndex={5}
                // as={Link}
                _hover={{ bg: "blackAlpha.700" }}
                onClick={() => router.back()}
              >
                <BsChevronLeft /> <Text> Back</Text>
              </Button>
              <Image
                alt="banner"
                src={
                  community?.coverImage || "/assets/community-default-bg.png"
                }
                h={"full"}
                w={"full"}
                objectFit={"cover"}
                objectPosition={"top"}
                opacity={0.75}
              />
              <Box pos={"absolute"} right={0} bottom={0} p={3}>
                <HStack rounded={"full"} bg={"rgba(0,0,0,0.45)"} px={3} py={1}>
                  <>
                    {community?.visibility === "private" ? (
                      <FiLock />
                    ) : (
                      <FiGlobe />
                    )}
                  </>
                  <Text
                    fontSize={"10px"}
                    textTransform={"uppercase"}
                    as={"span"}
                  >
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
              mt={{ lg: -20, base: "-75px" }}
              pos={"relative"}
            >
              <Box
                rounded={"full"}
                w={{ lg: 150, base: 130 }}
                h={{ lg: 150, base: 130 }}
                boxShadow={"0 0 0 4px #8a8f91"}
                bg={"gray.700 m,"}
                overflow={"hidden"}
              >
                <Image
                  alt=""
                  src={community?.displayImage || "/assets/community-dp.png"}
                  h={"full"}
                  w={"full"}
                  objectFit={"cover"}
                />
              </Box>
              <Heading as={"h1"} textAlign={"center"} mt={{ lg: 14, base: 0 }}>
                {community?.name}
              </Heading>
            </Flex>
          </Box>
          <Flex
            borderTop={"4px"}
            borderTopColor={"gray.900"}
            direction={{ lg: "row", base: "column" }}
            // gap={3}
            flex={1}
            maxH={"full"}
            h={"full"}
          >
            <Flex
              borderBottom={{ base: "2px", lg: "none" }}
              borderBottomColor={"gray.600"}
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
              // h={"full"}
              pos={"sticky"}
              bg={"gray.900"}
              top={0}
            >
              {[tabButtons]}
            </Flex>

            <Box
              flex={1}
              px={4}
              borderX={{ lg: "1px" }}
              borderColor={{ lg: "gray.600" }}
            >
              <TabPanels
                activeTab={activeTab}
                spaceIdOrId={slugId}
                description={community?.description!}
              />
            </Box>
            <Box px={4} hideBelow={"lg"} pos={"sticky"} top={0} bg={"gray.900"}>
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
      slugId: slugId as string,
    },
  };
}
