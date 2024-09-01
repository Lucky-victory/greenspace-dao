import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { HeaderNav } from "src/components/HeaderNav";
import { getAllSupplements } from "src/pages/api/supplements";
import { Supplement } from "src/types";
import { FaSearch, FaFilter } from "react-icons/fa";

function Shop({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [expertId, setExpertId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode } = useColorMode();

  const supplements = useMemo(() => {
    let filteredData = data;
    if (expertId !== 0) {
      filteredData = filteredData.filter((ele) => ele.recommendations.some((item) => item.expertId === expertId));
    }
    if (searchTerm) {
      filteredData = filteredData.filter((ele) => ele.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filteredData;
  }, [data, expertId, searchTerm]);

  const handleExpertSelect = (_expertId: number) => {
    setExpertId((prev) => (prev === _expertId ? 0 : _expertId));
  };

  const bgGradient = useColorModeValue(
    "linear(236deg,#DCDDDB 0%, #329648 0%, white 100%)",
    "linear(236deg,#DCDDDB 0%, #329648 0%, black 100%)"
  );
  const overlayBg = useColorModeValue("rgba(255, 255, 255, 0.44)", "rgba(41, 41, 41, 0.44)");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      maxW={"1350"}
      mx={"auto"}
      as="main"
      bgRepeat={"no-repeat"}
      bgGradient={bgGradient}
      minH={"100vh"}
      pos={"relative"}
      borderRadius="xl"
      overflow="hidden"
    >
      <Box h={"full"} bg={overlayBg} backdropFilter={"blur(30px)"} pt={"calc(20px + var(--navbar-height))"}>
        <HeaderNav />

        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading size={"xl"} textAlign="center" color={textColor}>
              Supplements{" "}
              <Text as="span" color={"gs-green.500"}>
                SHOP
              </Text>
              <Text as="span" color={"gs-yellow.400"}>
                !
              </Text>
            </Heading>

            <HStack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search supplements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="full"
                />
              </InputGroup>
              <Button
                leftIcon={<FaFilter />}
                onClick={() => {
                  /* Implement advanced filter */
                }}
                borderRadius="full"
              >
                Filters
              </Button>
            </HStack>

            <Box>
              <Heading size="md" color={textColor} mb={4}>
                Choose by Experts
              </Heading>
              <HStack spacing={4}>
                <Button
                  variant={expertId === 1 ? "solid" : "outline"}
                  onClick={() => handleExpertSelect(1)}
                  borderRadius="full"
                >
                  Andrew Huberman
                </Button>
                <Button
                  variant={expertId === 2 ? "solid" : "outline"}
                  onClick={() => handleExpertSelect(2)}
                  borderRadius="full"
                >
                  Bryan Johnson
                </Button>
              </HStack>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {supplements.map((item, i) => (
                <Card
                  key={i}
                  bg={cardBg}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="lg"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                >
                  <CardBody display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md" color={textColor}>
                        {item.title}
                      </Heading>
                      <Text color={textColor}>{item.intro}</Text>
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" color={mutedTextColor} mb={2}>
                          IMPROVE
                        </Text>
                        <Flex gap={2} wrap="wrap">
                          {item.attributes.map((ele, j) => (
                            <Badge key={j} borderRadius="full" px={2} py={1}>
                              {ele}
                            </Badge>
                          ))}
                        </Flex>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" color={mutedTextColor} mb={2}>
                          RECOMMENDATION
                        </Text>
                        {item.recommendations.map((ele, j) => (
                          <HStack key={j} spacing={2} mb={2}>
                            <Image
                              alt={ele.name}
                              src={ele.image}
                              width={30}
                              height={30}
                              style={{ borderRadius: "50%" }}
                            />
                            <Text color={textColor}>{ele.name}</Text>
                            <Text fontSize="small" color={mutedTextColor}>
                              {ele.doseage}
                            </Text>
                          </HStack>
                        ))}
                      </Box>
                    </VStack>
                    <Link href={item.link} target="_blank" style={{ width: "100%" }}>
                      <Button width="full" colorScheme="green" mt={4} borderRadius="full">
                        Buy Now
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

export const getServerSideProps = (async (context) => {
  const data = await getAllSupplements();
  return { props: { data } };
}) satisfies GetServerSideProps<{ data: Supplement[] }>;

export default Shop;
