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
  useColorModeValue
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { HeaderNav } from "src/components/HeaderNav";
import { getAllSupplements } from "src/pages/api/supplements";
import { Supplement } from "src/types";

function Shop({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [expertId, setExpertId] = useState(0);
  const { colorMode } = useColorMode();

  const supplements = useMemo(() => {
    if (expertId === 0) return data;
    return data.filter((ele) => {
      return ele.recommendations.some((item) => item.expertId === expertId);
    });
  }, [data, expertId]);

  const handleExpertSelect = (_expertId: number) => {
    setExpertId((prev) => {
      if (prev === _expertId) return 0;
      else return _expertId;
    });
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
    >
      <Box h={"full"} bg={overlayBg} backdropFilter={"blur(30px)"}>
        <HeaderNav />

        <Heading mb={6} mt={4} width={"100%"} size={"xl"} display={"flex"} justifyContent={"center"} color={textColor}>
          Supplements <Text color={"gs-green.500"}> SHOP</Text>
          <Text color={"gs-yellow.400"}>!</Text>
        </Heading>
        <Flex p={4} flexDirection={"column"}>
          {/* Filters */}
          <Box>
            <Heading size="md" color={textColor}>
              Choose by Experts
            </Heading>
            <Box mt={2} display="flex" gap={2}>
              <Button variant={expertId === 1 ? "solid" : "outline"} onClick={() => handleExpertSelect(1)}>
                Andrew Huberman
              </Button>
              <Button variant={expertId === 2 ? "solid" : "outline"} onClick={() => handleExpertSelect(2)}>
                Bryan Johnson
              </Button>
            </Box>
          </Box>
          {/* Items */}
          <Box pt={6} flex={1} px={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {supplements.map((item, i) => (
                <Card key={i} bg={cardBg}>
                  <CardBody display="flex" flexDirection="column">
                    <Heading size="md" color={textColor}>
                      {item.title}
                    </Heading>
                    <Text mt={2} color={textColor}>
                      {item.intro}
                    </Text>
                    <Text fontSize="sm" fontWeight={"bold"} color={mutedTextColor} mt={2}>
                      IMPROVE
                    </Text>
                    <Flex gap={2} wrap={"wrap"} mt={1}>
                      {item.attributes.map((ele, j) => (
                        <Badge key={j}>{ele}</Badge>
                      ))}
                    </Flex>

                    <Text fontSize="sm" fontWeight={"bold"} color={mutedTextColor} mt={2}>
                      RECOMMENDATION
                    </Text>
                    {item.recommendations.map((ele, j) => (
                      <Flex key={j} gap={2} wrap={"wrap"} alignItems="center" mt={2}>
                        <Image alt={ele.name} src={ele.image} width={30} height={30} style={{ borderRadius: 4 }} />

                        <Text color={textColor}>{ele.name}</Text>
                        <Text fontSize={"small"} color={mutedTextColor}>
                          {ele.doseage}
                        </Text>
                      </Flex>
                    ))}
                    <Flex flex={1} alignItems={"flex-end"}>
                      <Link style={{ width: "100%" }} href={item.link} target="_blank">
                        <Button width={"full"} variant={"outline"} mt={3}>
                          Buy Now
                        </Button>
                      </Link>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export const getServerSideProps = (async (context) => {
  // Fetch data from external API
  const data = await getAllSupplements();
  // Pass data to the page via props
  return { props: { data } };
}) satisfies GetServerSideProps<{ data: Supplement[] }>;

export default Shop;
