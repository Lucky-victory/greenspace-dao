import { Box, Button, Flex, Heading, Stack, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
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
    <Flex
      as={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      direction={{ base: "column", md: "row" }}
      align="center"
      justify="space-between"
      minHeight="90vh"
      px={{ base: 4, md: 12 }}
      py={12}
      color={textColor}
      position="relative"
      zIndex={1}
    >
      <VStack as={motion.div} variants={itemVariants} align="flex-start" spacing={8} maxW={{ base: "100%", md: "50%" }}>
        <Heading as={motion.h1} variants={itemVariants} size="3xl" fontWeight="bold" lineHeight="shorter">
          Live Longer and Healthier with{" "}
          <Text as="span" color={highlightColor}>
            GreenSpace
          </Text>
        </Heading>
        <Text as={motion.p} variants={itemVariants} fontSize="xl" lineHeight="tall" fontWeight="semibold">
          Add up to 10 quality years to your life through personalized nutrition and lifestyle coaching
        </Text>
        <Text as={motion.p} variants={itemVariants} fontSize="lg" lineHeight="tall">
          Join thousands who've already improved their health markers and energy levels. Get expert guidance, custom
          meal plans, and a supportive community to help you thrive.
        </Text>
        <Stack as={motion.div} variants={itemVariants} direction={{ base: "column", sm: "row" }} spacing={4}>
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
            _hover={{ bg: buttonHoverBg }}
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
