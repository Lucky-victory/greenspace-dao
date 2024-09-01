import { Link } from "@chakra-ui/next-js";
import { Box, Button, Flex, Heading, Icon, Image, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const listItemHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export default function CommunityArea() {
  const bgColor = useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(0, 0, 0, 0.7)");
  const borderColor = useColorModeValue("gs-gray.200", "gs-gray.700");
  const highlightColor = useColorModeValue("gs-green.600", "gs-yellow.500");

  return (
    <Flex
      as={motion.div}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      gap={5}
      wrap={{ base: "wrap", lg: "nowrap" }}
      mt={12}
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 12 }}
      justify={"space-between"}
      // bg={bgColor}
      // backdropFilter={"blur(10px)"}
      // borderRadius="xl"
      // boxShadow="xl"
    >
      <Box as={motion.div} variants={fadeIn}>
        <Image
          minW={300}
          flexShrink={0}
          src="/assets/community.jpg"
          alt=""
          // maxH={{ base: 350, sm: "auto" }}
          maxW={{ base: "auto" }}
          w={"full"}
          rounded={"20px"}
          objectFit={"cover"}
          boxShadow="lg"
        />
      </Box>
      <Stack as={motion.div} variants={fadeIn} maxW={{ lg: 550, base: "auto" }}>
        <Heading mb={5} size={"2xl"} color={highlightColor}>
          Join the Longevity Revolution
        </Heading>
        <Text mb={4} maxW={{ lg: 500, base: "auto" }} lineHeight={"taller"}>
          Welcome to the <b>Green Heads</b> community – your go-to place for living longer and healthier! We&apos;re
          here to make your health journey fun and doable. Here&apos;s what you&apos;ll get:
        </Text>
        <Stack spacing={3}>
          <Flex as={motion.div} whileHover={listItemHover} align="center">
            <Stack
              flexShrink={0}
              w={6}
              h={6}
              // justifyContent={"center"}
              bg={highlightColor}
              borderRadius="full"
              p={1}
              mr={2}
            >
              <Icon as={LuCheck} color="white" />
            </Stack>
            Weekly challenges to build lasting health habits
          </Flex>
          <Flex as={motion.div} whileHover={listItemHover} align="center">
            <Stack
              flexShrink={0}
              w={6}
              h={6}
              // justifyContent={"center"}
              bg={highlightColor}
              borderRadius="full"
              p={1}
              mr={2}
            >
              <Icon as={LuCheck} color="white" />
            </Stack>
            Group check-ins to keep you motivated
          </Flex>
          <Flex as={motion.div} whileHover={listItemHover} align="center">
            <Stack
              flexShrink={0}
              w={6}
              h={6}
              // justifyContent={"center"}
              bg={highlightColor}
              borderRadius="full"
              p={1}
              mr={2}
            >
              <Icon as={LuCheck} color="white" />
            </Stack>
            Science-backed tips for a longer life
          </Flex>
          <Flex as={motion.div} whileHover={listItemHover} align="center">
            <Stack
              flexShrink={0}
              w={6}
              h={6}
              // justifyContent={"center"}
              bg={highlightColor}
              borderRadius="full"
              p={1}
              mr={2}
            >
              <Icon as={LuCheck} color="white" />
            </Stack>
            A friendly community that makes health enjoyable
          </Flex>{" "}
        </Stack>
        <Text mt={5} fontWeight="bold">
          Ready to live longer? Join Green Heads today and start your journey to a brighter future!
        </Text>
        <Button
          as="a"
          href="#join-community"
          size="lg"
          colorScheme="gs-green"
          fontWeight="bold"
          mt={2}
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          borderRadius="full"
          width={{ base: "100%", sm: "fit-content" }}
        >
          Join Our Community
        </Button>
      </Stack>
    </Flex>
  );
}
