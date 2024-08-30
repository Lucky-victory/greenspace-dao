import { Box, Button, Flex, Heading, Stack, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function HeroArea() {
  const highlightColor = useColorModeValue("gs-green.500", "gs-yellow.400");

  return (
    <Flex
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      direction={{ base: "column", md: "row" }}
      align="center"
      justify="space-between"
      minHeight="90vh"
      px={{ base: 4, md: 12 }}
      py={12}
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <VStack align="flex-start" spacing={8} maxW={{ base: "100%", md: "50%" }}>
        <Heading as="h1" size="3xl" fontWeight="bold" lineHeight="shorter">
          Unlock Your Longevity Potential with{" "}
          <Text as="span" color={highlightColor}>
            GreenSpace
          </Text>
        </Heading>
        <Text fontSize="xl" lineHeight="tall">
          Join a thriving community of health-conscious individuals and expert nutritionists. Embrace personalized
          challenges, one-on-one coaching, and evidence-based strategies to live longer, healthier, and happier.
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
          <Button
            as="a"
            href="#join-community"
            size="lg"
            colorScheme="gs-green"
            fontWeight="bold"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
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
            _hover={{ bg: "gs-yellow.50" }}
          >
            Learn More
          </Button>
        </Stack>
      </VStack>

      <Box
        as={motion.div}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        w={{ base: "100%", md: "45%" }}
        mt={{ base: 8, md: 0 }}
      >
        <Box
          as="video"
          muted
          loop
          autoPlay
          src="/assets/group-video.mp4"
          w="100%"
          h="auto"
          minH={{ base: 300, sm: 400 }}
          rounded="2xl"
          objectFit="cover"
          boxShadow="2xl"
        >
          <Text>Your browser does not support the video tag.</Text>
        </Box>
      </Box>
    </Flex>
  );
}
