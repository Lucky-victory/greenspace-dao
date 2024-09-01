import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  Image,
  SimpleGrid,
  Container,
  AvatarGroup,
  Avatar,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import HealthBrands from "../HealthBrands";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HeroArea() {
  const textColor = useColorModeValue("gray.800", "gray.100");
  const highlightColor = useColorModeValue("gs-green.600", "gs-yellow.400");
  const highlightColorBase = useColorModeValue("gs-green.200", "gs-yellow.400");
  const buttonHoverBg = useColorModeValue("gs-yellow.50", "gs-yellow.800");

  return (
    <>
      <Container maxW="container.xl" pb={6} pt={"calc(32px + var(--navbar-height))"} px={0}>
        <Flex
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          minHeight={{ base: "auto", md: "70vh" }}
          gap={{ base: 12, lg: 16 }}
        >
          <VStack
            as={motion.div}
            variants={itemVariants}
            align={{ base: "center", lg: "flex-start" }}
            spacing={4}
            px={4}
            maxW={{ base: "100%", lg: "50%" }}
            textAlign={{ base: "center", lg: "left" }}
          >
            <HStack wrap={"wrap"} justify={"center"}>
              <AvatarGroup size={"sm"}>
                <Avatar src={"/images/man.jpg"} />
                <Avatar src={"/images/girl-1.jpg"} />
                <Avatar src={"/images/woman-1.jpg"} />
                <Avatar src={"/images/guy-1.jpg"} />
                <Avatar src={"/images/woman-2.jpg"} />
              </AvatarGroup>{" "}
              <Text as={"span"} fontSize={"md"} fontWeight={600}>
                Over 10,000 happy members
              </Text>
            </HStack>

            <Heading
              as={motion.h1}
              variants={itemVariants}
              fontSize={{ base: "4xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="shorter"
            >
              Feel Great with{" "}
              <Text as="span" color={{ base: highlightColorBase, lg: highlightColor }}>
                GreenSpace
              </Text>
            </Heading>
            <Text
              as={motion.p}
              variants={itemVariants}
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="tall"
              fontWeight="semibold"
              maxW={{ base: "600px" }}
            >
              Get personalized help to eat better, move more, and live healthier
            </Text>
            <Text
              maxW={{ base: "600px" }}
              as={motion.p}
              variants={itemVariants}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="tall"
            >
              Join thousands who are already feeling more energetic and healthier. We&apos;ll guide you step-by-step
              with custom meal ideas, exercise tips, and a friendly community cheering you on.
            </Text>
            <Stat>
              <StatLabel>Members report feeling better by</StatLabel>
              <StatNumber>42%</StatNumber>
              <StatHelpText>Just 6 months after joining</StatHelpText>
            </Stat>
            <Stack>
              <Stack
                as={motion.div}
                variants={itemVariants}
                direction={{ base: "column", sm: "row" }}
                spacing={4}
                width="100%"
                justify={{ base: "center", lg: "flex-start" }}
              >
                <Button
                  as="a"
                  href="#get-started"
                  size="lg"
                  colorScheme="gs-green"
                  fontWeight="bold"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  borderRadius="full"
                  width={{ base: "100%", sm: "auto" }}
                >
                  Get Started
                </Button>
                <Button
                  as="a"
                  href="#learn-more"
                  size="lg"
                  variant="outline"
                  colorScheme="gs-yellow"
                  fontWeight="bold"
                  _hover={{ bg: buttonHoverBg }}
                  borderRadius="full"
                  width={{ base: "100%", sm: "auto" }}
                >
                  See How It Works
                </Button>
              </Stack>
            </Stack>
          </VStack>

          <Box as={motion.div} w={{ base: "100%", lg: "50%" }} maxW="800px" hideBelow={"sm"} pr={{ lg: 4 }}>
            <SimpleGrid row={4} columns={{ base: 1, sm: 2 }} spacing={4} gridAutoFlow="dense">
              <Image
                as={motion.img}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 } as any}
                src="/assets/healthy-meal.jpg"
                alt="A colorful, healthy meal"
                w="100%"
                h={{ base: "200px", sm: "200px" }}
                rounded="xl"
                objectFit="cover"
                boxShadow="lg"
                objectPosition="center"
              />
              <Image
                as={motion.img}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 } as any}
                src="/assets/exercise.jpg"
                alt="People enjoying outdoor exercise"
                w="100%"
                h={{ base: "200px", sm: "200px" }}
                rounded="xl"
                objectFit="cover"
                boxShadow="lg"
              />
              <Image
                as={motion.img}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 } as any}
                src="/assets/community-support.jpg"
                alt="Friends supporting each other"
                w="100%"
                h={{ base: "200px", sm: "200px" }}
                rounded="xl"
                objectFit="cover"
                boxShadow="lg"
              />
              <Image
                as={motion.img}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 } as any}
                alt="Person relaxing in nature"
                src="/assets/meditation.jpg"
                w="100%"
                h={{ base: "200px", sm: "200px" }}
                rounded="xl"
                objectFit="cover"
                boxShadow="lg"
              />
            </SimpleGrid>
          </Box>
        </Flex>
      </Container>
      <HealthBrands />
    </>
  );
}
