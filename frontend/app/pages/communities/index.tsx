import PageLoader from "@/components/PageLoader";
import PageWrapper from "@/components/PageWrapper";

import Icon from "@/components/Icon";
import { HeaderNav } from "@/components/HeaderNav";
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
import { Community } from "@/types/state";
import { useAppContext } from "@/context/state";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";

export default function CommunitiesPage() {
  // const toast = useToast({
  //   duration: 3000,
  //   position: 'top',
  //   status: 'success',
  //   title: 'Your appointment was booked successfully',
  // });
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const router = useRouter();
  const { communities, setCommunity } = useAppContext();
  const handleJoin = (community: Community | null) => {
    setCommunity(community);
    router.push("/community/" + community?.slug);
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
                {communities?.map((c, i) => {
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
                        {c.cover && <Avatar size={"lg"} src={c.cover} />}
                        {!c.cover && (
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
                            {c.name}
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
                          onClick={() => handleJoin(c)}
                          ml={"auto"}
                          // className='bg-primaryYellow text-primaryGreen'
                          gap={2}
                          rounded={"full"}
                          size={"md"}
                        >
                          <Icon size={24} name="group_add" /> Join Community
                        </Button>
                      </Flex>
                      {c?.description && (
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
                            {c.description}
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
