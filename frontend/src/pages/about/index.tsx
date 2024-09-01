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
  Link as ChakraLink
} from "@chakra-ui/react";
import PageWrapper from "src/components/PageWrapper";
import Footer from "src/components/Footer";
import { HeaderNav } from "src/components/HeaderNav";
import Head from "next/head";

const AboutPage: React.FC = () => {
  return (
    <>
      <HeaderNav />
      <Head>
        <title>About GreenSpace</title>
      </Head>
      {/* <PageWrapper> */}
      <Container maxW="container.lg" pb={6} pt={"calc(20px + var(--navbar-height))"}>
        <VStack spacing={12} align="stretch">
          <Heading as="h1" size="2xl" mb={8}>
            About GreenSpace
          </Heading>

          <Box>
            <Heading as="h2" size="xl" mb={4}>
              Empowering Health and Wellness
            </Heading>
            <Text fontSize="lg" mb={4}>
              At GreenSpace, we&apos;re dedicated to helping you achieve your health and wellness goals. Our mission is
              to provide personalized support, expert guidance, and a vibrant community to empower you on your journey
              to a healthier lifestyle.
            </Text>
            <Box bg="green.100" p={4} borderRadius="lg">
              <Text fontSize="xl" fontWeight="semibold">
                Join over 10,000 happy members who are feeling great with GreenSpace!
              </Text>
            </Box>
          </Box>

          <Box>
            <Heading as="h2" size="xl" mb={4}>
              Our Approach
            </Heading>
            <Text fontSize="lg" mb={4}>
              We believe in a holistic approach to health and wellness. Our platform offers:
            </Text>
            <UnorderedList ml={4} mb={4} spacing={2}>
              <ListItem>Personalized meal plans tailored to your unique needs</ListItem>
              <ListItem>Expert nutritionist guidance to support your goals</ListItem>
              <ListItem>A supportive community to keep you motivated</ListItem>
              <ListItem>Customized exercise recommendations</ListItem>
              <ListItem>Educational resources to help you make informed decisions</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="xl" mb={4}>
              The GreenSpace Difference
            </Heading>
            <Text fontSize="lg" mb={4}>
              What sets us apart is our commitment to your success. Our members report feeling 42% better just 6 months
              after joining. We provide:
            </Text>
            <UnorderedList ml={4} mb={4} spacing={2}>
              <ListItem>Step-by-step guidance for eating better and moving more</ListItem>
              <ListItem>Custom meal ideas that fit your preferences and lifestyle</ListItem>
              <ListItem>Exercise tips to help you stay active and energized</ListItem>
              <ListItem>A friendly community to cheer you on every step of the way</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="xl" mb={4}>
              Join the GreenSpace Family
            </Heading>
            <Text fontSize="lg" mb={4}>
              Becoming a part of GreenSpace means joining a community that cares about your well-being. Here&apos;s what
              you can look forward to:
            </Text>
            <UnorderedList ml={4} mb={4} spacing={2}>
              <ListItem>Connecting with like-minded individuals on a similar journey</ListItem>
              <ListItem>Participating in fun weekly challenges to build lasting health habits</ListItem>
              <ListItem>Learning easy-to-apply tips for a longer, better life</ListItem>
              <ListItem>Receiving ongoing support and motivation from our friendly community</ListItem>
            </UnorderedList>
            <Text fontSize="lg" fontWeight="semibold">
              Ready to feel great and live better? Join GreenSpace today and start your journey to a brighter, healthier
              you!
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="xl" mb={4}>
              Our Partners
            </Heading>
            <Text fontSize="lg" mb={4}>
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
              ].map((partner) => (
                <GridItem key={partner} bg="gray.100" p={4} borderRadius="lg">
                  <Text textAlign="center">{partner}</Text>
                </GridItem>
              ))}
            </Grid>
          </Box>

          <Box>
            <Heading as="h2" size="xl" mb={4}>
              Join Our Team
            </Heading>
            <Text fontSize="lg" mb={4}>
              Are you a nutrition professional passionate about helping others achieve their health goals? We&apos;d
              love to have you on our team! Reach out to us at{" "}
              <ChakraLink
                href="mailto:apply@greenspacedao.xyz"
                color="green.600"
                _hover={{ textDecoration: "underline" }}
              >
                apply@greenspacedao.xyz
              </ChakraLink>
            </Text>
          </Box>
        </VStack>
      </Container>
      {/* </PageWrapper> */}
      <Footer />
    </>
  );
};

export default AboutPage;
