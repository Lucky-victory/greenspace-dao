import PageLoader from "src/components/PageLoader";
import PageWrapper from "src/components/PageWrapper";

import Icon from "src/components/Icon";
import { HeaderNav } from "src/components/HeaderNav";
import {
  useToast,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import BoringAvatar from "boring-avatars";
//@ts-ignore
import DatePicker from "react-datepicker";
import { Community } from "src/types/shared";
import { useAppContext } from "src/context/state";
import { useRouter } from "next/router";
import Footer from "src/components/Footer";
import {
  useCheckHasJoinCommunityMutation,
  useGetCommunitiesQuery,
  useJoinCommunityMutation,
} from "src/state/services";
import { useInAppAuth } from "src/hooks/common";
import isEmpty from "just-is-empty";
import { Link } from "@chakra-ui/next-js";

export default function CommunitiesPage() {
  const { data, isLoading } = useGetCommunitiesQuery({});
  const communities = data?.data!;

  const router = useRouter();

  return (
    <>
      <PageWrapper bg="gray.800">
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
                {communities?.map((comm, i) => {
                  return (
                    <Box
                      maxW={{ lg: "50%" }}
                      key={"nutri" + i}
                      bg={"blackAlpha.700"}
                      rounded={"md"}
                      px={4}
                      py={5}
                      flex={1}
                      minW={500}
                    >
                      <HStack gap={4} mb={5} wrap={"wrap"}>
                        {comm.displayImage && (
                          <Avatar size={"lg"} src={comm.displayImage} />
                        )}
                        {!comm.displayImage && (
                          <BoringAvatar
                            variant="sunset"
                            colors={[
                              "#92A1C6",
                              "#146A7C",
                              "#F0AB3D",
                              "#C271B4",
                              "#C20D90",
                            ]}
                          />
                        )}
                        <Box>
                          <Heading as={"h3"} mb={2} size={"md"}>
                            {comm.name}
                          </Heading>
                        </Box>
                        <Button
                          as={Link}
                          href={"/community/" + comm.spaceId}
                          ml={"auto"}
                          gap={2}
                          colorScheme="gs-yellow"
                          rounded={"full"}
                          size={"sm"}
                        >
                          Explore the community
                        </Button>
                      </HStack>
                      {comm?.description && (
                        <Box>
                          <Heading mb={3} as={"h4"} size={"md"}>
                            Description
                          </Heading>
                          <Text pb={4} color={"gray.100"}>
                            {comm.description}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          </Box>
        </PageLoader>
      </PageWrapper>
      <Footer />
    </>
  );
}
