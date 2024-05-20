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
import { useGetCommunityEventQuery } from "src/state/services";
import { useRouter } from "next/router";
import { format } from "date-fns";
import isEmpty from "just-is-empty";
import { FiCalendar, FiHome, FiMapPin } from "react-icons/fi";
import { formatDateWithOrdinal } from "src/utils";

export default function EventPage({
  eventId: eventIdFromServer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const eventId = eventIdFromServer || (router.query?.eventId as string);
  const {
    data: eventResponse,
    isLoading,
    isFetching,
  } = useGetCommunityEventQuery({
    slugId: eventId,
  });
  const event = eventResponse?.data;
  function formatDate(date: Date | string, fmt: string = "MMM d, yyyy") {
    if (isEmpty(date)) return "";
    if (typeof date === "string") {
      date = new Date(date);
    }

    return format(new Date(date), fmt);
  }
  return (
    <>
      <Head>
        <title>{event?.title}</title>
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
              <Image
                alt=""
                src="/assets/community.jpg"
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
                <Stack as={List} gap={3} mb={4}>
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
                        <Text>Location: {event?.location}</Text>
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
                  size={"lg"}
                  rounded={"full"}
                >
                  Join the Event
                </Button>
              </Stack>
              <Stack
                minW={{ base: 300, md: 350, lg: 400 }}
                flex={{ base: 1, lg: 0 }}
                flexShrink={0}
                bg={"black"}
                rounded={"15px"}
                border={"1px solid var(--chakra-colors-gray-600)"}
                p={{ base: 5, lg: 8 }}
              >
                <Heading size={"lg"} fontWeight={600} mb={2}>
                  Join the next event!
                </Heading>
                <Text fontSize={"15px"} color={"gray.300"}>
                  We launch new events every month, and they fill up quickly.
                  Add your email to get notified when new events are available.
                </Text>
                <Stack mt={4}>
                  <Input
                    _focus={{
                      boxShadow: "0 0 0 1px transparent",
                      borderColor: "gs-yellow.400",
                    }}
                    autoComplete="email"
                    type="email"
                    placeholder="me@example.com"
                    rounded={"full"}
                    size={"lg"}
                  />
                </Stack>
                <Button
                  mt={2}
                  colorScheme="gs-gray"
                  size={"lg"}
                  rounded={"full"}
                >
                  Get notified
                </Button>
              </Stack>
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
