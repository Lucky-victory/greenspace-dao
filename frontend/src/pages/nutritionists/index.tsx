import { HeaderNav } from "src/components/HeaderNav";
import PageWrapper from "src/components/PageWrapper";

import { useCreateAppointmentMutation, useGetNutritionistsQuery } from "src/state/services";
import { NewAppointment, Nutritionist } from "src/state/types";
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
  Text,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Head from "next/head";
import { useEffect, useState } from "react";
//@ts-ignore
import DatePicker from "react-datepicker";
import { HiOutlineBookOpen, HiOutlineLocationMarker } from "react-icons/hi";
import { usePrivy } from "@privy-io/react-auth";
import { addMinutesToDate, convertJsDateToMysqlDate } from "src/utils";
import PageLoader from "src/components/PageLoader";

const data: Partial<Nutritionist>[] = [
  {
    id: 1,
    fullName: "Michelle Sanchez",
    authId: "bcjsMCSNuihgb",
    bio: `Michelle is a passionate nutritionist dedicated to helping individuals achieve their health and wellness goals through proper nutrition. With a Bachelor's degree in Nutrition and years of experience in the field, she possesses a deep understanding of the vital role that food plays in our lives.
    `,
    avatar: "/images/f-user-47.jpg",
    country: "Mexico",
  },
  {
    id: 2,
    fullName: "Chris Eze",
    authId: "ydueuHDyuiprk",
    bio: ` Chris is a seasoned nutritionist with a strong commitment to improving lives through the power of nutrition. Armed with a Master's degree in Nutritional Science and a wealth of expertise, he brings a holistic perspective to the table.`,
    avatar: "/images/m-user-30.jpg",
    country: "Nigeria",
  },
  {
    id: 3,
    fullName: "Rachel Brooke",
    authId: "vfueuHDyuiprk",
    bio: `Rachel is a dedicated nutritionist on a mission to inspire healthier living through balanced eating. Armed with a Bachelor's degree in Nutrition and years of practical experience, she possesses a deep-rooted passion for helping individuals unlock their full wellness potential. `,
    avatar: "/images/f-user-53.jpg",
    country: "United States",
  },
  {
    id: 4,
    fullName: "Anna Will",
    authId: "uvseuHDyuiprk",
    bio: ` Anna is a highly skilled nutritionist with a strong commitment to promoting wellness through informed dietary choices. Holding a Master's degree in Nutritional Science and a wealth of experience, she brings a comprehensive understanding of the intricate relationship between nutrition and health. 
    `,
    avatar: "/images/f-user-26.jpg",
    country: "United States",
  },
];
const sectionTimes = [30, 45, 60, 90, 120];
export default function NutritionistPage() {
  const toast = useToast({
    duration: 3000,
    position: "top",
    status: "success",
    title: "Your appointment was booked successfully",
  });

  const { user } = usePrivy();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: nutritionistResponse } = useGetNutritionistsQuery({});
  console.log({ nutritionistResponse });

  const [selectedNutritionist, setSelectedNutritionist] = useState<Partial<Nutritionist> | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [sectionDuration, setSectionDuration] = useState(30);
  const [appointment, setAppointment] = useState<NewAppointment>({
    requestedBy: user?.id,
    duration: sectionDuration,
    nutritionistId: "",
    startTime: null,
    endTime: null,
  });

  const handleClick = (nutritionist: Partial<Nutritionist>) => {
    onOpen();
    setSelectedNutritionist(nutritionist);

    setAppointment((prev) => ({
      ...prev,
      nutritionistId: nutritionist?.authId!,
    }));
  };
  const handleDateSelect = (date: Date) => {
    setBookingDate(date);

    setShowBookingDetails(true);
  };
  const handleDateChange = (date: Date) => {
    setBookingDate(date);
  };
  const handleSectionDuration = (dur: number) => {
    setSectionDuration(dur);

    setShowBookingDetails(true);
  };
  function handleAppointmentModalClose() {
    resetAppointment();
    onClose();
  }
  function resetAppointment() {
    setSelectedNutritionist(null);
    setSectionDuration(30);
    setAppointment({
      requestedBy: user?.id,
      duration: sectionDuration,
      nutritionistId: "",
      startTime: null,
      endTime: null,
    });
  }
  async function handleBookingSubmit() {
    setIsSubmitting(true);
    await createAppointment(appointment).unwrap();

    setTimeout(() => {
      setIsSubmitting(false);
      toast();
      handleAppointmentModalClose();
    }, 2000);
  }
  useEffect(() => {
    setAppointment((prev) => ({
      ...prev,
      requestedBy: user?.id,
      duration: sectionDuration,
      startTime: convertJsDateToMysqlDate(bookingDate),
      endTime: convertJsDateToMysqlDate(addMinutesToDate(sectionDuration, bookingDate)),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingDate, sectionDuration, user]);

  return (
    <PageLoader>
      <Head>
        <title>Find a Nutrionists | GreenspaceDAO</title>
        <meta
          name="description"
          content="Want to Live Healthier and Longer?
We're building healthy communities focused on longevity all around the world, we want to help people live longer, better through community inclusive programs that improve productivity,"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:image" content={"https://greenspacedao.xyz/opengraph.png"} />
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <PageWrapper>
        <Box
          // className="bg-primaryYellowTrans"
          // h={'100vh'}
          px={6}
          overflowY={"auto"}
          pb={12}
        >
          <HeaderNav />
          <Box maxW={"1300"} mx={"auto"}>
            <Heading size={"lg"} letterSpacing={"1px"} my={4} bg={"gray.900"} py={4} px={3} rounded={"md"}>
              Find Nutritionists from around the world
            </Heading>
            <Flex gap={6} wrap={"wrap"}>
              {data.map((nutritionist, i) => {
                return (
                  <Box
                    key={"nutri" + i}
                    bg={"gray.800"}
                    rounded={"md"}
                    px={4}
                    py={5}
                    flex={1}
                    minW={{ lg: 500, base: "300" }}
                  >
                    <Flex wrap={"wrap"} align={"start"} gap={4} mb={5}>
                      <HStack>
                        <Avatar size={"lg"} src={nutritionist.avatar} />
                        <Box>
                          <Heading letterSpacing={"1px"} as={"h3"} mb={2} size={"md"}>
                            {nutritionist.fullName}
                          </Heading>
                          <Text as={Flex} gap={1}>
                            <HiOutlineLocationMarker name="location_on" size={20} /> {nutritionist.country}
                          </Text>
                        </Box>
                      </HStack>
                      <Button
                        onClick={() => handleClick(nutritionist)}
                        ml={"auto"}
                        gap={2}
                        fontWeight={500}
                        rounded={"full"}
                        size={"md"}
                      >
                        <HiOutlineBookOpen size={24} name="book" /> Book an Appointment
                      </Button>
                    </Flex>
                    <Box>
                      <Heading mb={3} as={"h4"} fontWeight={600} size={"sm"}>
                        About {nutritionist.fullName}
                      </Heading>
                      <Text fontSize={"14px"} fontWeight={300} pb={4}>
                        {nutritionist.bio}{" "}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            </Flex>
          </Box>

          <Modal size={"3xl"} isOpen={isOpen} onClose={handleAppointmentModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Booking appointment</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb={5}>
                  You&apos;re booking <span>{selectedNutritionist?.fullName} </span>
                </Text>
                {/* {showBookingDetails && ( */}
                <Box>
                  <Text fontWeight={"semibold"} mb={2}>
                    {" "}
                    Appointment Details:
                  </Text>
                  <Text>
                    {" "}
                    <span> Date: </span>
                    {format(bookingDate, "E, d MMM yyyy hh:mm aaa")}
                  </Text>
                  <Text>
                    {" "}
                    <span>Duration:</span> {sectionDuration} Mins{" "}
                  </Text>
                </Box>
                {/* )} */}
                <Flex wrap={"wrap"} gap={6}>
                  <Box>
                    <Heading size={"md"} my={4}>
                      Choose appointment date
                    </Heading>

                    <DatePicker
                      minDate={new Date()}
                      showTimeSelect
                      inline
                      selectsStart
                      selected={bookingDate}
                      onSelect={handleDateSelect} //when day is clicked
                      onChange={handleDateChange} //only when value has changed
                    />
                  </Box>
                  <Box>
                    <Heading size={"md"} my={4}>
                      Section Duration
                    </Heading>

                    <Flex gap={4} wrap={"wrap"} maxW={350}>
                      {sectionTimes.map((dur, i) => {
                        return (
                          <Button
                            onClick={() => handleSectionDuration(dur)}
                            key={"dur" + i}
                            variant={"ghost"}
                            colorScheme="gs-yellow"
                            bg={sectionDuration === dur ? "gs-yellow.300" : ""}
                            color={sectionDuration === dur ? "gs-yellow.900" : ""}
                            // className={`text-primaryGreen rounded-full px-4 py-2 border ${
                            //   sectionDuration === dur ? "bg-primaryYellow" : ""
                            // }`}
                          >
                            {dur} Mins
                          </Button>
                        );
                      })}
                    </Flex>
                  </Box>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant={"outline"}
                  rounded={"full"}
                  colorScheme="gray"
                  mr={3}
                  onClick={handleAppointmentModalClose}
                >
                  Cancel
                </Button>
                <Button
                  rounded={"full"}
                  onClick={handleBookingSubmit}
                  variant="solid"
                  isDisabled={isSubmitting || isLoading}
                  isLoading={isSubmitting || isLoading}
                >
                  Complete Booking
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </PageWrapper>
    </PageLoader>
  );
}
