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
  useColorMode,
  useColorModeValue,
  Container,
  VStack,
  Badge,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonCircle
} from "@chakra-ui/react";
import { format } from "date-fns";
import Head from "next/head";
import { useEffect, useState } from "react";
//@ts-ignore
import DatePicker from "react-datepicker";
import { HiOutlineCalendar, HiOutlineLocationMarker, HiSearch } from "react-icons/hi";
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
    country: "Mexico"
  },
  {
    id: 2,
    fullName: "Chris Eze",
    authId: "ydueuHDyuiprk",
    bio: ` Chris is a seasoned nutritionist with a strong commitment to improving lives through the power of nutrition. Armed with a Master's degree in Nutritional Science and a wealth of expertise, he brings a holistic perspective to the table.`,
    avatar: "/images/m-user-30.jpg",
    country: "Nigeria"
  },
  {
    id: 3,
    fullName: "Rachel Brooke",
    authId: "vfueuHDyuiprk",
    bio: `Rachel is a dedicated nutritionist on a mission to inspire healthier living through balanced eating. Armed with a Bachelor's degree in Nutrition and years of practical experience, she possesses a deep-rooted passion for helping individuals unlock their full wellness potential. `,
    avatar: "/images/f-user-53.jpg",
    country: "United States"
  },
  {
    id: 4,
    fullName: "Anna Will",
    authId: "uvseuHDyuiprk",
    bio: ` Anna is a highly skilled nutritionist with a strong commitment to promoting wellness through informed dietary choices. Holding a Master's degree in Nutritional Science and a wealth of experience, she brings a comprehensive understanding of the intricate relationship between nutrition and health. 
    `,
    avatar: "/images/f-user-26.jpg",
    country: "United States"
  }
];
const sectionTimes = [30, 45, 60, 90, 120];
export default function NutritionistPage() {
  const toast = useToast({
    duration: 3000,
    position: "top",
    status: "success",
    title: "Your appointment was booked successfully"
  });

  const { user } = usePrivy();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: nutritionistResponse, isLoading: isLoadingNutritionists } = useGetNutritionistsQuery({});
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
    endTime: null
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNutritionists, setFilteredNutritionists] = useState(data);

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.100");
  const headerBgColor = useColorModeValue("white", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.800");

  const handleClick = (nutritionist: Partial<Nutritionist>) => {
    onOpen();
    setSelectedNutritionist(nutritionist);

    setAppointment((prev) => ({
      ...prev,
      nutritionistId: nutritionist?.authId!
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
      endTime: null
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
      endTime: convertJsDateToMysqlDate(addMinutesToDate(sectionDuration, bookingDate))
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingDate, sectionDuration, user]);

  useEffect(() => {
    const filtered = data.filter(
      (nutritionist) =>
        nutritionist.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nutritionist.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNutritionists(filtered);
  }, [searchTerm]);

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
        <Box bg={bgColor} color={textColor} minH="100vh">
          <HeaderNav />
          <Container maxW="container.xl" py={12}>
            <Heading size="2xl" mb={8} textAlign="center">
              Find Nutritionists from around the world
            </Heading>
            <Box mb={8}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <HiSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search by name or country"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={cardBgColor}
                  rounded="full"
                />
              </InputGroup>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {isLoadingNutritionists
                ? Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <Box key={index} bg={cardBgColor} rounded="xl" shadow="md" overflow="hidden">
                        <VStack p={6} spacing={4} align="stretch">
                          <HStack spacing={4}>
                            <SkeletonCircle size="16" />
                            <VStack align="start" spacing={1} flex={1}>
                              <Skeleton height="24px" width="80%" />
                              <Skeleton height="20px" width="60%" />
                              <Skeleton height="24px" width="40%" />
                            </VStack>
                          </HStack>
                          <Skeleton height="60px" />
                          <Skeleton height="40px" />
                        </VStack>
                      </Box>
                    ))
                : filteredNutritionists.map((nutritionist, i) => (
                    <Box
                      key={"nutri" + i}
                      bg={cardBgColor}
                      rounded="xl"
                      shadow="md"
                      overflow="hidden"
                      transition="all 0.3s"
                      _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
                    >
                      <VStack p={6} spacing={4} align="stretch">
                        <HStack spacing={4}>
                          <Avatar size="xl" src={nutritionist.avatar} />
                          <VStack align="start" spacing={1}>
                            <Heading as="h3" size="lg">
                              {nutritionist.fullName}
                            </Heading>
                            <HStack>
                              <HiOutlineLocationMarker />
                              <Text fontSize="md">{nutritionist.country}</Text>
                            </HStack>
                            <Badge colorScheme="green" rounded="full" px={3} py={1}>
                              Available
                            </Badge>
                          </VStack>
                        </HStack>
                        <Text fontSize="md" fontWeight="medium" noOfLines={3}>
                          {nutritionist.bio}
                        </Text>
                        <Button
                          onClick={() => handleClick(nutritionist)}
                          colorScheme="blue"
                          size="lg"
                          rounded="full"
                          leftIcon={<HiOutlineCalendar />}
                        >
                          Book Appointment
                        </Button>
                      </VStack>
                    </Box>
                  ))}
            </SimpleGrid>
          </Container>

          <Modal isOpen={isOpen} onClose={handleAppointmentModalClose} size={{ base: "full", sm: "3xl", lg: "4xl" }}>
            <ModalOverlay />
            <ModalContent rounded="2xl">
              <ModalHeader>Book an Appointment</ModalHeader>
              <ModalCloseButton />
              <ModalBody px={{ base: 2, md: 4 }}>
                <VStack spacing={6} align="stretch">
                  <Text fontSize="lg" fontWeight="bold">
                    You&apos;re booking with {selectedNutritionist?.fullName}
                  </Text>
                  <Box bg={useColorModeValue("gray.100", "gray.700")} p={4} rounded="xl">
                    <Text fontWeight="semibold" mb={2}>
                      Appointment Details:
                    </Text>
                    <Text>Date: {format(bookingDate, "E, d MMM yyyy hh:mm aaa")}</Text>
                    <Text>Duration: {sectionDuration} Mins</Text>
                  </Box>

                  <Flex direction={{ base: "column", md: "row" }} wrap="wrap" justify="space-between" gap={6}>
                    <Box flex={1} width={{ base: "100%", md: "auto" }}>
                      <Heading size="md" mb={4}>
                        Choose appointment date
                      </Heading>
                      <DatePicker
                        minDate={new Date()}
                        showTimeSelect
                        inline
                        selectsStart
                        selected={bookingDate}
                        onSelect={handleDateSelect}
                        onChange={handleDateChange}
                      />
                    </Box>
                    <Box flex={1} width={{ base: "100%", md: "auto" }}>
                      <Heading size="md" mb={4}>
                        Session Duration
                      </Heading>
                      <Flex gap={4} wrap="wrap">
                        {sectionTimes.map((dur, i) => (
                          <Button
                            key={"dur" + i}
                            onClick={() => handleSectionDuration(dur)}
                            colorScheme={sectionDuration === dur ? "blue" : "gray"}
                            variant={sectionDuration === dur ? "solid" : "outline"}
                            rounded="full"
                          >
                            {dur} Mins
                          </Button>
                        ))}
                      </Flex>
                    </Box>
                  </Flex>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleAppointmentModalClose} rounded="full">
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleBookingSubmit}
                  isLoading={isSubmitting || isLoading}
                  loadingText="Booking..."
                  rounded="full"
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
