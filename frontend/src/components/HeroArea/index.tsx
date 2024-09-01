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
  HStack
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
            spacing={5}
            px={4}
            maxW={{ base: "100%", lg: "50%" }}
            textAlign={{ base: "center", lg: "left" }}
          >
            <Heading
              as={motion.h1}
              variants={itemVariants}
              fontSize={{ base: "4xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="shorter"
            >
              Live Longer and Healthier with{" "}
              <Text as="span" color={highlightColor}>
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
              Add up to 10 quality years to your life through personalized nutrition and lifestyle coaching
            </Text>
            <Text
              maxW={{ base: "600px" }}
              as={motion.p}
              variants={itemVariants}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="tall"
            >
              Join thousands who&apos;ve already improved their health markers and energy levels. Get expert guidance,
              custom meal plans, and a supportive community to help you thrive.
            </Text>
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
                  href="#join-community"
                  size="lg"
                  colorScheme="gs-green"
                  fontWeight="bold"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  borderRadius="full"
                  width={{ base: "100%", sm: "auto" }}
                >
                  Join Our Community
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
                  Learn More
                </Button>
              </Stack>
              <HStack mt={2}>
                <AvatarGroup size={"md"}>
                  <Avatar src={"/images/man.jpg"} />
                  <Avatar src={"/images/girl-1.jpg"} />
                  <Avatar src={"/images/woman-1.jpg"} />
                  <Avatar src={"/images/guy-1.jpg"} />
                  <Avatar src={"/images/woman-2.jpg"} />
                </AvatarGroup>{" "}
                <Text as={"span"} fontSize={"large"} fontWeight={600}>
                  1000+ Happy users
                </Text>
              </HStack>
            </Stack>
          </VStack>

          <Box as={motion.div} w={{ base: "100%", lg: "50%" }} maxW="800px" hideBelow={"sm"} pr={{ lg: 4 }}>
            <SimpleGrid row={4} columns={{ base: 1, sm: 2 }} spacing={4} gridAutoFlow="dense">
              <Image
                as={motion.img}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 } as any}
                src="/assets/healthy-meal.jpg"
                alt="Healthy meal"
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
                alt="People exercising"
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
                alt="Community support group"
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
                alt="Person meditating"
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
