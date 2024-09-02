import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Grid,
  GridItem,
  Link as ChakraLink,
  useColorModeValue
} from "@chakra-ui/react";
import PageWrapper from "src/components/PageWrapper";
import Footer from "src/components/Footer";
import { HeaderNav } from "src/components/HeaderNav";
import Head from "next/head";

const AboutPage: React.FC = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const highlightBgColor = useColorModeValue("green.100", "green.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const headingColor = useColorModeValue("green.600", "green.300");
  const itemBgColor = useColorModeValue("gray.100", "gray.600");

  return (
    <>
      <HeaderNav />
      <Head>
        <title>About GreenSpace</title>
      </Head>
      <Box bg={bgColor} minHeight="100vh">
        <Container maxW="container.xl" pb={12} pt={"calc(20px + var(--navbar-height))"}>
          <VStack spacing={12} align="stretch">
            <Heading as="h1" size="2xl" mb={8} color={headingColor}>
              About GreenSpace
            </Heading>

            <Box bg={cardBgColor} p={8} borderRadius="xl" boxShadow="md">
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                Empowering Health and Wellness
              </Heading>
              <Text fontSize="lg" mb={4} color={textColor}>
                At GreenSpace, we&apos;re dedicated to helping you achieve your health and wellness goals. Our mission
                is to provide personalized support, expert guidance, and a vibrant community to empower you on your
                journey to a healthier lifestyle.
              </Text>
              <Box bg={highlightBgColor} p={6} borderRadius="lg">
                <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                  Join over 10,000 happy members who are feeling great with GreenSpace!
                </Text>
              </Box>
            </Box>

            <Box bg={cardBgColor} p={8} borderRadius="xl" boxShadow="md">
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                Our Approach
              </Heading>
              <Text fontSize="lg" mb={4} color={textColor}>
                We believe in a holistic approach to health and wellness. Our platform offers:
              </Text>
              <UnorderedList ml={4} mb={4} spacing={2} color={textColor}>
                <ListItem>Personalized meal plans tailored to your unique needs</ListItem>
                <ListItem>Expert nutritionist guidance to support your goals</ListItem>
                <ListItem>A supportive community to keep you motivated</ListItem>
                <ListItem>Customized exercise recommendations</ListItem>
                <ListItem>Educational resources to help you make informed decisions</ListItem>
              </UnorderedList>
            </Box>

            <Box bg={cardBgColor} p={8} borderRadius="xl" boxShadow="md">
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                The GreenSpace Difference
              </Heading>
              <Text fontSize="lg" mb={4} color={textColor}>
                What sets us apart is our commitment to your success. Our members report feeling 42% better just 6
                months after joining. We provide:
              </Text>
              <UnorderedList ml={4} mb={4} spacing={2} color={textColor}>
                <ListItem>Step-by-step guidance for eating better and moving more</ListItem>
                <ListItem>Custom meal ideas that fit your preferences and lifestyle</ListItem>
                <ListItem>Exercise tips to help you stay active and energized</ListItem>
                <ListItem>A friendly community to cheer you on every step of the way</ListItem>
              </UnorderedList>
            </Box>

            <Box bg={cardBgColor} p={8} borderRadius="xl" boxShadow="md">
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                Join the GreenSpace Family
              </Heading>
              <Text fontSize="lg" mb={4} color={textColor}>
                Becoming a part of GreenSpace means joining a community that cares about your well-being. Here&apos;s
                what you can look forward to:
              </Text>
              <UnorderedList ml={4} mb={4} spacing={2} color={textColor}>
                <ListItem>Connecting with like-minded individuals on a similar journey</ListItem>
                <ListItem>Participating in fun weekly challenges to build lasting health habits</ListItem>
                <ListItem>Learning easy-to-apply tips for a longer, better life</ListItem>
                <ListItem>Receiving ongoing support and motivation from our friendly community</ListItem>
              </UnorderedList>
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                Ready to feel great and live better? Join GreenSpace today and start your journey to a brighter,
                healthier you!
              </Text>
            </Box>

            <Box bg={cardBgColor} p={8} borderRadius="xl" boxShadow="md">
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                Our Partners
              </Heading>
              <Text fontSize="lg" mb={4} color={textColor}>
                We&apos;re proud to collaborate with leading brands in the health and wellness industry to bring you the
                best resources and support:
              </Text>
              <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }} gap={4}>
                {[
                  "MyFitnessPal",
                  "Fitbit",
                  "Herbalife",
                  "GNC",
                  "Optimum Nutrition",
                  "Quest Nutrition",
                  "Muscle Milk",
                  "Nature&apos;s Bounty",
                  "Centrum",
                  "Ensure"
                ].map((partner) => {
                  return (
                    <GridItem key={partner} bg={itemBgColor} p={4} borderRadius="lg">
                      <Text textAlign="center" color={textColor}>
                        {partner}
                      </Text>
                    </GridItem>
                  );
                })}
              </Grid>
            </Box>

            <Box bg={cardBgColor} p={8} borderRadius="xl" boxShadow="md">
              <Heading as="h2" size="xl" mb={4} color={headingColor}>
                Join Our Team
              </Heading>
              <Text fontSize="lg" mb={4} color={textColor}>
                Are you a nutrition professional passionate about helping others achieve their health goals? We&apos;d
                love to have you on our team! Reach out to us at{" "}
                <ChakraLink
                  href="mailto:apply@greenspacedao.xyz"
                  color={useColorModeValue("green.600", "green.300")}
                  _hover={{ textDecoration: "underline" }}
                >
                  apply@greenspacedao.xyz
                </ChakraLink>
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AboutPage;
