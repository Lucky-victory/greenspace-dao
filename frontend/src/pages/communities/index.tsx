import PageLoader from "src/components/PageLoader";
import PageWrapper from "src/components/PageWrapper";

import { HeaderNav } from "src/components/HeaderNav";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  HStack,
  Stack,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
//@ts-ignore
import { Community } from "src/types/shared";
import { useRouter } from "next/router";
import Footer from "src/components/Footer";
import {
  useCheckHasJoinCommunityMutation,
  useGetCommunitiesQuery,
  useJoinCommunityMutation,
} from "src/state/services";
import { useInAppAuth } from "src/hooks/common";
import { Link } from "@chakra-ui/next-js";
import { FiEye, FiUsers } from "react-icons/fi";
import { CardLoading } from "src/components/CommunityPage/CardLoading";
import { shortenText } from "src/utils";
import Head from "next/head";

export default function CommunitiesPage() {
  const { data, isLoading, isFetching } = useGetCommunitiesQuery({});
  const communities = data?.data!;
  const { isLoggedIn, user, connect } = useInAppAuth();
  const [joinCommunity, { isLoading: isJoiningComm }] =
    useJoinCommunityMutation();
  const [checkHasJoinCommunity, { isLoading: isCheckingJoin }] =
    useCheckHasJoinCommunityMutation();
  const [hasJoined, setHasJoined] = useState(false);
  const router = useRouter();

  async function handleJoinCommunity(community: Community) {
    if (!isLoggedIn) {
      connect();
      return;
    }
    await checkHasJoinCommunity({
      communityId: community.id,
      spaceIdOrId: community.spaceId,
      userId: user?.id!,
    })
      .unwrap()
      .then(async (res) => {
        const hasJoined = res.data.hasJoined;
        setHasJoined(hasJoined);
        if (!isCheckingJoin && !hasJoined) {
          await joinCommunity({
            communityId: community.id,
            spaceIdOrId: community.spaceId,
            userId: user?.id!,
          }).unwrap();
        }
      });
  }
  return (
    <>
      <PageWrapper bg="gray.800">
        <Head>
          <title>GreenspaceDAO | Communities</title>
        </Head>
        <PageLoader>
          <HeaderNav />

          <Box
            // className='bg-primaryYellowTrans'
            // h={'100vh'}
            px={6}
            overflowY={"auto"}
            pb={12}
          >
            <Box maxW={"1300"} mx={"auto"}>
              <Heading
                size={"lg"}
                my={4}
                // bg={"gray.900"}
                py={4}
                px={3}
                rounded={"md"}
              >
                Find people with similar interest
              </Heading>
              <Flex gap={{ base: 4, md: 5, lg: 6 }} wrap={"wrap"}>
                {(isLoading || isFetching) &&
                  [0, 0, 0, 0].map((_, i) => (
                    <CardLoading key={"comm-loading" + i} />
                  ))}
                {!isLoading && !isFetching && (
                  <HStack gap={4} wrap={"wrap"} align={"stretch"}>
                    {communities.map((community) => (
                      <Stack
                        overflow={"hidden"}
                        key={community.spaceId}
                        rounded={"12px"}
                        border={"1px"}
                        minW={250}
                        borderColor={"gray.600"}
                        maxW={{ base: "100%", md: "300" }}
                      >
                        <Box h={150} pos={"relative"}>
                          <Image
                            pos={"absolute"}
                            alt=""
                            w={70}
                            h={70}
                            rounded={"full"}
                            left={2}
                            bottom={2}
                            border={"2px"}
                            borderColor={"gray.500"}
                            src={
                              community?.displayImage ||
                              "/assets/community-dp.png"
                            }
                          />
                          <Image
                            alt=""
                            src={
                              community?.coverImage ||
                              "/assets/community-default-bg.png"
                            }
                            h={"full"}
                            objectFit={"cover"}
                            w={"full"}
                          />
                        </Box>
                        <Box p={3}>
                          <Heading size={"md"} mb={2}>
                            {community.name}
                          </Heading>
                          {community.description && (
                            <Text fontSize={"13px"}>
                              {shortenText(community.description || "", 120)}
                            </Text>
                          )}
                        </Box>
                        <Stack
                          px={3}
                          pb={4}
                          gap={3}
                          flex={1}
                          justify={"flex-end"}
                        >
                          <Button
                            as={Link}
                            variant={"outline"}
                            href={"/community/" + community.spaceId}
                            ml={"auto"}
                            gap={2}
                            colorScheme="gs-yellow"
                            rounded={"full"}
                            size={"sm"}
                            w={"full"}
                          >
                            <FiEye />
                            Explore community
                          </Button>
                          <Button
                            onClick={() => handleJoinCommunity(community)}
                            ml={"auto"}
                            gap={2}
                            isLoading={isJoiningComm || isCheckingJoin}
                            loadingText={`${
                              isCheckingJoin
                                ? "Checking..."
                                : isJoiningComm
                                ? "Joining..."
                                : ""
                            }`}
                            colorScheme="gs-yellow"
                            rounded={"full"}
                            w={"full"}
                            size={"sm"}
                            isDisabled={hasJoined}
                          >
                            <FiUsers />{" "}
                            {hasJoined ? "Joined" : "Join community"}
                          </Button>
                        </Stack>
                      </Stack>
                    ))}
                  </HStack>
                )}
              </Flex>
            </Box>
          </Box>
        </PageLoader>
      </PageWrapper>
      <Footer />
    </>
  );
}
