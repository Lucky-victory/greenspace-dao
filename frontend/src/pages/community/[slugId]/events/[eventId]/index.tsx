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
  Image,
  Input,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import MarkdownRenderer from "src/components/MarkdownRenderer";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {
  useCheckHasJoinCommunityEventMutation,
  useGetCommunityEventQuery,
  useJoinCommunityEventMutation,
} from "src/state/services";
import { useRouter } from "next/router";
import { format } from "date-fns";
import isEmpty from "just-is-empty";
import { FiCalendar, FiHome, FiMapPin } from "react-icons/fi";
import { formatDateWithOrdinal } from "src/utils";
import GetNotifiedForm from "src/components/GetNotified";
import { useEffect } from "react";
import { useInAppAuth } from "src/hooks/common";
import { BsChevronLeft } from "react-icons/bs";

export default function EventPage({
  eventId: eventIdFromServer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { connect, isLoggedIn, user } = useInAppAuth();
  const router = useRouter();
  const eventSlug = eventIdFromServer || (router.query?.eventId as string);
  const {
    data: eventResponse,
    isLoading,
    isFetching,
  } = useGetCommunityEventQuery({
    slugId: eventSlug,
  });
  const event = eventResponse?.data;

  const [joinEvent, { isLoading: isLoadingJoin }] =
    useJoinCommunityEventMutation();
  const [
    checkEventJoin,
    { isLoading: isLoadingHasJoin, data: hasJoinResponse },
  ] = useCheckHasJoinCommunityEventMutation();
  const hasJoined = hasJoinResponse?.data?.hasJoined;
  function formatDate(date: Date | string, fmt: string = "MMM d, yyyy") {
    if (isEmpty(date)) return "";
    if (typeof date === "string") {
      date = new Date(date);
    }

    return format(new Date(date), fmt);
  }

  async function handleEventJoin() {
    if (!isLoggedIn) {
      connect();
      return;
    }
    await joinEvent({
      eventId: event?.id,
      userId: user?.id as string,
      slugId: eventSlug,
    }).unwrap();
  }

  useEffect(
    () => {
      if (isLoggedIn && event?.id) {
        checkEventJoin({
          eventId: event?.id,
          userId: user?.id as string,
          slugId: eventSlug,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoadingJoin, isLoading, isLoggedIn, user?.id, event?.id, eventSlug]
  );
  return (
    <>
      <Head>
        <title>{event?.title}</title>
        <meta name="description" content={event?.details} />
        <meta property="og:title" content={event?.title} />
        <meta property="og:description" content={event?.details} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={event?.coverImage} />
        {/* <meta property="og:url" content={`https://greenspacedao.xyz/`} /> */}
        <meta property="og:site_name" content={event?.title} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="en_GB" />
      </Head>
      <PageLoader isLoading={isLoading || isFetching} text="Fetching event...">
        <HeaderNav />
        <PageWrapper
          props={{ pt: 30, px: { base: 4, md: 5, lg: 8 } }}
          bg="transaprent"
        >
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
                // as={Link}
                _hover={{ bg: "blackAlpha.700" }}
                onClick={() => router.back()}
              >
                <BsChevronLeft /> <Text> Back</Text>
              </Button>
              <Image
                alt=""
                src={event?.coverImage || "/assets/community.jpg"}
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
                <Heading mb={4} size={{ base: "xl", md: "2xl" }}>
                  {event?.title} (Starts {formatDate(event?.startDate, "MMM")}{" "}
                  {formatDateWithOrdinal(event?.startDate)})
                </Heading>
                <Text fontSize={"lg"}>
                  Event dates: {formatDate(event?.startDate)} -{" "}
                  {formatDate(event?.endDate)}
                </Text>
              </Box>
            </Box>
          </Box>
          <Flex
            align={"flex-start"}
            wrap={{ base: "wrap", lg: "nowrap" }}
            gap={{ base: 12, lg: 10 }}
            mb={10}
          >
            <Box>
              <Heading size={"xl"} fontWeight={600} mb={4}>
                Event Information
              </Heading>
              <Box pb={4} lineHeight={1.9}>
                <MarkdownRenderer markdown={event?.details} />
              </Box>
            </Box>
            <Stack pos={"sticky"} top={0} gap={5} flex={{ base: 1, lg: 0 }}>
              <Stack
                minW={{ base: 300, md: 350 }}
                flexShrink={0}
                bg={"black"}
                rounded={"15px"}
                border={"1px solid var(--chakra-colors-gray-600)"}
                p={{ base: 5, lg: 8 }}
              >
                <Heading size={"lg"} fontWeight={600} mb={2}>
                  Event Details
                </Heading>
                <Stack as={List} pl={0} gap={3} mb={4}>
                  <ListItem>
                    <HStack>
                      <FiCalendar size={20} />
                      <Text>
                        <Text as={"span"} color={"gray.400"}>
                          Start Date:
                        </Text>{" "}
                        {formatDate(event?.startDate, "MMM dd, yyyy HH:mm a")}
                      </Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack>
                      <FiCalendar size={20} />
                      <Text>
                        <Text as={"span"} color={"gray.400"}>
                          End Date:
                        </Text>{" "}
                        {formatDate(event?.endDate, "MMM dd, yyyy HH:mm a")}
                      </Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack>
                      <FiHome size={20} />
                      <Text>
                        {" "}
                        <Text as={"span"} color={"gray.500"}>
                          Venue:
                        </Text>{" "}
                        {event?.venue}
                      </Text>
                    </HStack>
                  </ListItem>
                  {event?.location && (
                    <ListItem>
                      <HStack>
                        <FiMapPin size={20} />
                        <Text>
                          {" "}
                          <Text as={"span"} color={"gray.500"}>
                            Location:
                          </Text>{" "}
                          {event?.location}
                        </Text>
                      </HStack>
                    </ListItem>
                  )}
                </Stack>
                <Text fontSize={"15px"} color={"gray.300"}>
                  Join the event and get notified when the event starts.
                </Text>
                <Button
                  mt={4}
                  colorScheme="gs-yellow"
                  onClick={handleEventJoin}
                  isLoading={isLoadingJoin || isLoadingHasJoin}
                  isDisabled={hasJoined}
                  size={"lg"}
                  rounded={"full"}
                >
                  {hasJoined ? "Joined" : "Join the Event"}
                </Button>
              </Stack>

              <GetNotifiedForm
                title="Join the next event!"
                description="We launch new events every month, and they fill up quickly. 
                Add your email to get notified when new events are available."
                notifyFor="event"
              />
            </Stack>
          </Flex>
        </PageWrapper>
      </PageLoader>
    </>
  );
}
export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { eventId } = query;

  // Pass the pathname as props
  return {
    props: {
      eventId: eventId as string,
    },
  };
}
