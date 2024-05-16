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
import { useGetCommunitiesQuery } from "src/state/services";

export default function CommunitiesPage() {
  const {data,isLoading}=useGetCommunitiesQuery({})
  const communities=data?.data!
  // const toast = useToast({
  //   duration: 3000,
  //   position: 'top',
  //   status: 'success',
  //   title: 'Your appointment was booked successfully',
  // });
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  
  const handleJoin = (community: Community | null) => {
    
    router.push("/community/" + community?.spaceId);
  };

  return (
    <>
      <PageWrapper>
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
                bg={"gray.900"}
                py={4}
                px={3}
                rounded={"md"}
              >
                Find people with similar interest
              </Heading>
              <Flex gap={6} wrap={"wrap"}>
                {communities?.map((comm, i) => {
                  return (
                    <Box
                      maxW={{ lg: "50%" }}
                      key={"nutri" + i}
                      bg={"gray.800"}
                      rounded={"md"}
                      px={4}
                      py={5}
                      flex={1}
                      minW={500}
                    >
                      <Flex align={"start"} gap={4} mb={5}>
                        {comm.displayImage && <Avatar size={"lg"} src={comm.displayImage} />}
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
                          <Heading
                            // className='text-primaryGreen'
                            as={"h3"}
                            mb={2}
                            size={"md"}
                          >
                            {comm.name}
                          </Heading>
                          {/* <Text
                         as={Flex}
                         gap={1}
                         alignItems={'center'}
                         fontWeight={'medium'}
                         className='text-secondaryGray'
                      >
                        <Icon name='group' size={20} /> {c.membersCount} members
                       </Text> */}
                        </Box>
                        <Button
                          onClick={() => handleJoin(comm)}
                          ml={"auto"}
                          // className='bg-primaryYellow text-primaryGreen'
                          gap={2}
                          rounded={"full"}
                          size={"md"}
                        >
                          <Icon size={24} name="group_add" /> Join Community
                        </Button>
                      </Flex>
                      {comm?.description && (
                        <Box>
                          <Heading
                            mb={3}
                            as={"h4"}
                            size={"md"}
                            // className='text-primaryGreen'
                          >
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
          <Footer />
        </PageLoader>
      </PageWrapper>
    </>
  );
}
