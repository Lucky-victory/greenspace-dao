import React from "react";
import { Link } from "@chakra-ui/next-js";
import { Box, Button, Flex, Heading, Icon, Image, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { LuCheck, LuUsers, LuTarget, LuBrain, LuHeart } from "react-icons/lu";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const listItemHover = {
  scale: 1.03,
  transition: { duration: 0.2 }
};

export default function CommunityArea() {
  const bgColor = useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(26, 32, 44, 0.7)");
  const borderColor = useColorModeValue("gs-gray.200", "gs-gray.700");
  const highlightColor = useColorModeValue("gs-green.600", "gs-yellow.500");

  const features = [
    { icon: LuUsers, text: "Connect with like-minded people who want to live healthier" },
    { icon: LuTarget, text: "Fun weekly challenges to build lasting health habits" },
    { icon: LuBrain, text: "Learn easy-to-apply tips for a longer, better life" },
    { icon: LuHeart, text: "Get support and motivation from our friendly community" }
  ];

  return (
    <Flex
      as={motion.div}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      gap={8}
      wrap={{ base: "wrap", lg: "nowrap" }}
      mt={16}
      py={{ base: 10, md: 16 }}
      px={{ base: 6, md: 12 }}
      justify={"space-between"}
      bg={bgColor}
      backdropFilter={"blur(10px)"}
      // borderRadius="2xl"
      // boxShadow="xl"
    >
      <Box as={motion.div} variants={fadeIn} flexBasis={{ base: "100%", lg: "40%" }}>
        <Image
          src="/assets/community.jpg"
          alt="Happy people in a GreenSpace community meetup"
          w={"full"}
          h={"full"}
          rounded={"xl"}
          objectFit={"cover"}
          boxShadow="lg"
        />
      </Box>
      <Stack as={motion.div} variants={fadeIn} flexBasis={{ base: "100%", lg: "55%" }} spacing={6}>
        <Heading color={highlightColor} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
          Join the GreenSpace Family
        </Heading>
        <Text fontSize="lg" lineHeight="tall">
          Welcome to the <b>GreenSpace community</b> – where living healthier becomes fun and achievable! We&apos;re
          here to support you every step of the way. Here&apos;s what you&apos;ll love about us:
        </Text>
        <Stack spacing={4}>
          {features.map((feature, index) => (
            <Flex key={index} as={motion.div} whileHover={listItemHover} align="center">
              <Box
                flexShrink={0}
                w={8}
                h={8}
                bg={highlightColor}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={3}
              >
                <Icon as={feature.icon} color="white" boxSize={5} />
              </Box>
              <Text fontSize="md">{feature.text}</Text>
            </Flex>
          ))}
        </Stack>
        <Text fontWeight="semibold" fontSize="lg" mt={2}>
          Ready to feel great and live better? Join GreenSpace today and start your journey to a brighter, healthier
          you!
        </Text>
        <Button
          as={Link}
          href="#join-community"
          size="lg"
          colorScheme="gs-green"
          fontWeight="bold"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          borderRadius="full"
          width={{ base: "100%", sm: "auto" }}
          alignSelf={{ base: "center", sm: "flex-start" }}
        >
          Join Our Community
        </Button>
      </Stack>
    </Flex>
  );
}
