import Footer from "src/components/Footer";
import { HeaderNav } from "src/components/HeaderNav";
import { maskHexAddress } from "src/helpers";
import { useGetUsersQuery } from "src/state/services";
import { Link } from "@chakra-ui/next-js";
import { Avatar, Box, Button, HStack, Heading, Stack } from "@chakra-ui/react";
import BoringAvatar from "boring-avatars";
import isEmpty from "just-is-empty";
import Head from "next/head";
import PageWrapper from "src/components/PageWrapper";

const MembersPage = () => {
  const { isLoading, isFetching, data } = useGetUsersQuery({ t: "all" });
  const users = [
    {
      id: 1,
      address: "0x7e3d53767637d78ce",
      fullName: "",
      username: "",
      avatar: "/images/user-54.jpg",
    },
    {
      id: 2,
      address: "0xcadea459737d78d8d",
      fullName: "",
      username: "",
      avatar: "",
    },
    {
      id: 3,
      address: "0x53767637d78d8d87c8de3950",
      fullName: "",
      username: "",
      avatar: "/images/user-53.jpg",
    },
    {
      id: 4,
      address: "0x8ced38098cd390a8388c839",
      fullName: "",
      username: "",
      avatar: "/images/user-59.jpg",
    },
    {
      id: 5,
      address: "0x73cda729de74d09f4c38d4a",
      fullName: "",
      username: "",
      avatar: "",
    },
  ];
  return (
    <>
      <Head>
        <title>GreenspaceDAO | Members</title>
      </Head>
      <HeaderNav />
      <PageWrapper props={{ minH: 500 }}>
        <Stack
          direction={"row"}
          px={{ lg: 6, base: 4 }}
          py={8}
          wrap={"wrap"}
          spacing={{ base: 4, lg: 6 }}
          mx={"auto"}
          maxW={1200}
          // bg={"gray.100"}
        >
          {!isLoading &&
            !isEmpty(users) &&
            users?.map((user) => (
              <Stack
                align={"center"}
                key={user?.id}
                rounded={"lg"}
                boxShadow={"md"}
                bg={"black"}
                minH={"250px"}
                p={4}
                maxW={350}
                gap={4}
                py={5}
              >
                <Box>
                  {user?.avatar ? (
                    <Avatar size={"md"} src={user?.avatar} w={"120px"} h={"120px"} />
                  ) : (
                    <BoringAvatar size={"120px"} variant="pixel" />
                  )}
                </Box>

                <Box>
                  <Heading size={"md"} mb={4} mt={1}>
                    {user?.fullName ? user?.fullName : maskHexAddress(user?.address)}
                  </Heading>

                  <HStack justify={"center"} spacing={"6"} flex={1}>
                    <Button as={Link} href={"/members/"} size={"sm"} variant="outline" gap={"3"}>
                      <span>View Profile</span>
                    </Button>
                  </HStack>
                </Box>
              </Stack>
            ))}
        </Stack>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default MembersPage;
