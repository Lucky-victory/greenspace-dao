import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashboardLayout from "src/components/AdminDashboardLayout";
import { Link } from "@chakra-ui/next-js";
import { FiPlus } from "react-icons/fi";
import { useGetCommunitiesQuery } from "src/state/services";
import isEmpty from "just-is-empty";
import { shortenText } from "src/utils";
export default function CommunitiesPage() {
  const {
    data: communitiesResponse,
    isLoading,
    isFetching,
  } = useGetCommunitiesQuery({});
  const communities = communitiesResponse?.data!;
  return (
    <DashboardLayout>
      <Flex direction={"column"} w={"full"} py={5} px={4}>
        <HStack justify={"space-between"}>
          <Heading mb={2}>Communities</Heading>
          <Button
            as={Link}
            href={"./communities/new"}
            colorScheme="gs-yellow"
            rounded={"full"}
            gap={2}
          >
            <FiPlus size={20} />
            New Community
          </Button>
        </HStack>
        <DashboardEmptyArea
          text="No Communities yet"
          isEmpty={isEmpty(communities) && !isLoading && !isFetching}
          isLoading={isLoading || isFetching}
        >
          {!isLoading && !isFetching && (
            <HStack gap={4} wrap={"wrap"} align={"stretch"}>
              {communities.map((community) => (
                <Stack
                  overflow={"hidden"}
                  key={community.spaceId}
                  rounded={"12px"}
                  border={"1px"}
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
                        community?.displayImage || "/assets/community-dp.png"
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
                      <Link
                        href={`/community/${community.spaceId}`}
                        color={"gs-yellow.500"}
                      >
                        {community.name}
                      </Link>
                    </Heading>
                    {community.description && (
                      <Text fontSize={"13px"}>
                        {shortenText(community.description || "", 100)}
                      </Text>
                    )}
                  </Box>
                  <Stack px={3} pb={4} gap={3} flex={1} justify={"flex-end"}>
                    <Button
                      size={"sm"}
                      colorScheme="gs-yellow"
                      rounded={"full"}
                      variant={"outline"}
                      as={Link}
                      href={`communities/new/challenges?cid=${community.id}`}
                    >
                      Create challenge
                    </Button>
                    <Button
                      colorScheme="gs-yellow"
                      size={"sm"}
                      rounded={"full"}
                      as={Link}
                      href={`communities/new/events?cid=${community.id}`}
                    >
                      Create event
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </HStack>
          )}
        </DashboardEmptyArea>
      </Flex>
    </DashboardLayout>
  );
}
