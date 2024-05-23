import { Badge, Box, Button, Card, CardBody, Container, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";
import { HeaderNav } from "src/components/HeaderNav";

const Shop = () => {
  return (
    <Box
      maxW={"1350"}
      mx={"auto"}
      as="main"
      bgRepeat={"no-repeat"}
      bgGradient={"linear(236deg,#DCDDDB 0%,, #329648 0%, black 100%)"}
      minH={"100vh"}
      pos={"relative"}
    >
      <Box h={"full"} bg={"rgba(41, 41, 41,0.44)"} backdropFilter={"blur(30px)"}>
        <HeaderNav />
        <Heading mb={6} mt={4} width={"100%"} size={"xl"} display={"flex"} justifyContent={"center"}>
          Suppliments <Text color={"gs-green.500"}>&nbsp;SHOP</Text>
          <Text color={"gs-yellow.400"}>!</Text>
        </Heading>
        <Flex p={4}>
          {/* Filters */}
          <Box>
            <Heading size="md">Choose by Experts</Heading>
            <Box mt={2} display="flex" gap={2}>
              <Button variant={"outline"}>Bryan Johnson</Button>
              <Button variant={"outline"}>Andrew Huberman</Button>
            </Box>
          </Box>
          {/* Items */}
          <Box pt={6} flex={1} px={4}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Card>
                <CardBody>
                  <Heading size="md">Alpha-GPC</Heading>
                  <Text mt={2}>
                    Alpha-GPC: A cognitive powerhouse that supports brain health and function. Enhances memory, focus,
                    and learning by providing a bioavailable form of choline, crucial for neurotransmitter synthesis.
                    Elevate your cognitive performance with this advanced supplement for mental clarity and brain
                    vitality.
                  </Text>
                  <Text fontSize="sm" fontWeight={"bold"} color="gray.500" mt={2}>
                    IMPROVE
                  </Text>
                  <Flex gap={2}>
                    <Badge>Focus</Badge>
                    <Badge>Brain</Badge>
                  </Flex>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Shop;
