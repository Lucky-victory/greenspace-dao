import DashboardEmptyArea from "src/components/DashboardEmptyArea";

import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Stack,
  Table,
  TableContainer,
} from "@chakra-ui/react";
import DashBoardLayout from "src/components/MemberDashboardLayout";
import { Link } from "@chakra-ui/next-js";
import { useGetCommunitiesQuery } from "src/state/services";
import { usePrivy } from "@privy-io/react-auth";
import isEmpty from "just-is-empty";
import TableItems from "src/components/TableItems";

export default function DashBoard() {
  const { user } = usePrivy();
  const { data: communitiesResponse, isLoading } = useGetCommunitiesQuery({
    userId: user?.id,
  });
  const communities = communitiesResponse?.data;
  return (
    <DashBoardLayout>
      <Flex direction={"column"} w={"full"} py={5} px={4}>
        <Heading
          mb={2}
          borderBottom={"1px solid var(--chakra-colors-gray-600)"}
        >
          Your communities
        </Heading>
        <DashboardEmptyArea
          text="You haven't joined any community yet."
          isEmpty={isEmpty(communities)}
          isLoading={isLoading}
        >
          <HStack justify={"center"} my={2} wrap={"wrap"}>
            {communities?.map((community) => (
              <Stack
                bg={"gray.800"}
                rounded={"12px"}
                border={"1px solid var(--chakra-colors-gray-600)"}
                key={community?.spaceId}
                w={"full"}
                overflow={"hidden"}
                maxW={{ base: "full", md: 300 }}
              >
                <Box h={120} bg={"gray.800"} pos={"relative"}>
                  <Image
                    alt=""
                    src={
                      community?.coverImage ||
                      "/assets/community-default-bg.png"
                    }
                    width={"full"}
                    height={"full"}
                    objectFit={"cover"}
                  />
                </Box>
                <Stack gap={3} p={4}>
                  <Heading size={"md"} as={"h3"}>
                    {community?.name}
                  </Heading>
                  <Button
                    colorScheme="gs-yellow"
                    as={Link}
                    size={"sm"}
                    rounded={"full"}
                    href={`/community/${community?.spaceId}`}
                  >
                    Visit community
                  </Button>
                </Stack>
              </Stack>
            ))}
          </HStack>
        </DashboardEmptyArea>
        <HStack justify={"center"} my={2} mt={5}>
          <Button as={Link} size={"lg"} href={"/communities"} rounded={"full"}>
            Join a community
          </Button>
        </HStack>
      </Flex>
    </DashBoardLayout>
  );
}
