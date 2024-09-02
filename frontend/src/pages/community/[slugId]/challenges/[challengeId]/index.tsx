import { HeaderNav } from "src/components/HeaderNav";
import Head from "next/head";
import PageWrapper from "src/components/PageWrapper";
import PageLoader from "src/components/PageLoader";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  List,
  ListItem,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import MarkdownRenderer from "src/components/MarkdownRenderer";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {
  useCheckHasJoinCommunityChallengeMutation,
  useGetCommunityChallengeQuery,
  useJoinCommunityChallengeMutation
} from "src/state/services";
import { useRouter } from "next/router";
import { format } from "date-fns";
import isEmpty from "just-is-empty";
import { FiCalendar, FiHome, FiMapPin } from "react-icons/fi";
import { formatDateWithOrdinal, replaceCloudflareIpfs } from "src/utils";
import GetNotifiedForm from "src/components/GetNotified";
import { useEffect } from "react";
import { useInAppAuth } from "src/hooks/common";
import { BsChevronLeft } from "react-icons/bs";

export default function ChallengePage({
  challengeId: challengeIdFromServer
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { connect, isLoggedIn, user } = useInAppAuth();
  const router = useRouter();
  const challengeSlug = challengeIdFromServer || (router.query?.challengeId as string);
  const {
    data: challengeResponse,
    isLoading,
    isFetching
  } = useGetCommunityChallengeQuery({
    slugId: challengeSlug
  });
  const challenge = challengeResponse?.data;

  const [joinChallenge, { isLoading: isLoadingJoin }] = useJoinCommunityChallengeMutation();
  const [checkChallengeJoin, { isLoading: isLoadingHasJoin, data: hasJoinResponse }] =
    useCheckHasJoinCommunityChallengeMutation();
  const hasJoined = hasJoinResponse?.data?.hasJoined;

  function formatDate(date: Date | string, fmt: string = "MMM d, yyyy") {
    if (isEmpty(date)) return "";
    if (typeof date === "string") {
      date = new Date(date);
    }

    return format(new Date(date), fmt);
  }

  async function handleChallengeJoin() {
    if (!isLoggedIn) {
      connect();
      return;
    }
    await joinChallenge({
      challengeId: challenge?.id,
      userId: user?.id as string,
      slugId: challengeSlug
    }).unwrap();
  }

  useEffect(
    () => {
      if (isLoggedIn && challenge?.id) {
        checkChallengeJoin({
          challengeId: challenge?.id,
          userId: user?.id as string,
          slugId: challengeSlug
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoadingJoin, isLoading, isLoggedIn, user?.id, challenge?.id, challengeSlug]
  );

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <>
      <Head>
        <title>{challenge?.title}</title>
        <meta name="description" content={challenge?.details} />
        <meta property="og:title" content={challenge?.title} />
        <meta property="og:description" content={challenge?.details} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={challenge?.coverImage} />
        <meta property="og:site_name" content={challenge?.title} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_GB" />
      </Head>
      <PageLoader isLoading={isLoading || isFetching}>
        <HeaderNav />
        <PageWrapper props={{ pt: 30, px: { base: 4, md: 5, lg: 8 } }}>
          <Box>
            <Box
              mb={16}
              h={{ base: 450, lg: 550 }}
              rounded={"25px"}
              bg={"black"}
              pos={"relative"}
              w={"full"}
              overflow={"hidden"}
            >
              <Button
                gap={2}
                bg={"blackAlpha.600"}
                variant={"ghost"}
                pos={"absolute"}
                top={3}
                left={3}
                colorScheme="gray"
                zIndex={5}
                _hover={{ bg: "blackAlpha.700" }}
                onClick={() => router.back()}
              >
                <BsChevronLeft /> <Text> Back</Text>
              </Button>
              <Image
                alt=""
                src={replaceCloudflareIpfs(challenge?.coverImage) || "/assets/community.jpg"}
                width={"full"}
                h={"full"}
                objectFit={"cover"}
                pos={"absolute"}
              />
              <Box
                pos={"absolute"}
                bottom={"0"}
                zIndex={3}
                left={"0"}
                w={"full"}
                p={{ base: 4, md: 10 }}
                h={"auto"}
                bg={"blackAlpha.800"}
              >
                <Heading mb={4} size={{ base: "xl", md: "2xl" }} color="white">
                  {challenge?.title} (Starts {formatDate(challenge?.startDate, "MMM")}{" "}
                  {formatDateWithOrdinal(challenge?.startDate)})
                </Heading>
                <Text fontSize={"lg"} color="white">
                  Challenge dates: {formatDate(challenge?.startDate)} - {formatDate(challenge?.endDate)}
                </Text>
              </Box>
            </Box>
          </Box>
          <Flex align={"flex-start"} wrap={{ base: "wrap", lg: "nowrap" }} gap={{ base: 12, lg: 10 }} mb={10}>
            <Box>
              <Heading size={"xl"} fontWeight={600} mb={4} color={textColor}>
                Challenge Information
              </Heading>
              <Box pb={4} lineHeight={1.9} color={textColor}>
                <MarkdownRenderer markdown={challenge?.details} />
              </Box>
            </Box>
            <Stack pos={"sticky"} top={0} gap={5} flex={{ base: 1, lg: 0 }}>
              <Stack
                minW={{ base: 300, md: 350 }}
                flexShrink={0}
                bg={bgColor}
                rounded={"15px"}
                border={`1px solid`}
                borderColor={`${borderColor}`}
                p={{ base: 5, lg: 8 }}
              >
                <Heading size={"lg"} fontWeight={600} mb={2} color={textColor}>
                  Challenge Details
                </Heading>
                <Stack as={List} pl={0} gap={3} mb={4} className="is-nav">
                  <ListItem>
                    <HStack>
                      <Icon as={FiCalendar} size={16} color={textColor} />
                      <Text fontSize={{ base: "small", md: "medium" }} color={textColor}>
                        <Text as={"span"} color={"gray.500"}>
                          Start Date:
                        </Text>{" "}
                        {formatDate(challenge?.startDate, "MMM dd, yyyy HH:mm a")}
                      </Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack>
                      <Icon as={FiCalendar} size={16} color={textColor} />
                      <Text fontSize={{ base: "small", md: "medium" }} color={textColor}>
                        <Text as={"span"} color={"gray.500"}>
                          End Date:
                        </Text>{" "}
                        {formatDate(challenge?.endDate, "MMM dd, yyyy HH:mm a")}
                      </Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack>
                      <Icon as={FiHome} size={16} color={textColor} />
                      <Text color={textColor}>
                        {" "}
                        <Text as={"span"} color={"gray.500"}>
                          Venue:
                        </Text>{" "}
                        {challenge?.venue}
                      </Text>
                    </HStack>
                  </ListItem>
                  {challenge?.location && (
                    <ListItem>
                      <HStack>
                        <Icon as={FiMapPin} size={16} color={textColor} />
                        <Text color={textColor}>
                          {" "}
                          <Text as={"span"} color={"gray.500"}>
                            Location:
                          </Text>{" "}
                          {challenge?.location}
                        </Text>
                      </HStack>
                    </ListItem>
                  )}
                </Stack>
                <Text fontSize={"15px"} color={"gray.500"}>
                  Join the challenge and get notified when the challenge starts.
                </Text>
                <Button
                  mt={4}
                  colorScheme="gs-yellow"
                  onClick={handleChallengeJoin}
                  isLoading={isLoadingJoin || isLoadingHasJoin}
                  isDisabled={hasJoined}
                  size={"lg"}
                  rounded={"full"}
                >
                  {hasJoined ? "Joined" : "Join the Challenge"}
                </Button>
              </Stack>
              <GetNotifiedForm
                title="Join the next challenge!"
                description="We launch new challenges every month, and they fill up quickly. 
                Add your email to get notified when new challenges are available."
                notifyFor="challenge"
              />
            </Stack>
          </Flex>
        </PageWrapper>
      </PageLoader>
    </>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { challengeId } = query;

  // Pass the pathname as props
  return {
    props: {
      challengeId: challengeId as string
    }
  };
}
