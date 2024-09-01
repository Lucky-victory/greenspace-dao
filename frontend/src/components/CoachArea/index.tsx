import React from "react";
import { Link } from "@chakra-ui/next-js";
import { Box, Button, Flex, Heading, Image, Stack, Text, useColorModeValue, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LuStar, LuTarget, LuHeart } from "react-icons/lu";
import { IconType } from "react-icons";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FeatureItem = ({ icon, text }: { icon: IconType; text: string }) => {
  const iconColor = useColorModeValue("gs-green.600", "gs-yellow.500");
  return (
    <Flex align="center" mb={3}>
      <Icon as={icon} color={iconColor} boxSize={5} mr={2} />
      <Text fontSize="md">{text}</Text>
    </Flex>
  );
};

export default function CoachArea() {
  const borderColor = useColorModeValue("gs-gray.200", "gs-gray.700");
  const headingColor = useColorModeValue("gs-gray.800", "white");
  const accentColor = useColorModeValue("gs-yellow.500", "gs-yellow.400");
  const textColor = useColorModeValue("gs-gray.600", "gs-gray.300");
  const bgColor = useColorModeValue("white", "gs-gray.800");

  return (
    <Flex
      as={motion.div}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      gap={8}
      borderBottom={"1px"}
      borderBottomColor={borderColor}
      wrap={{ base: "wrap-reverse", lg: "nowrap" }}
      mt={16}
      py={{ base: 10, md: 16 }}
      px={{ base: 6, md: 12 }}
      justify={"space-between"}
      bg={bgColor}
      // borderRadius="2xl"
      // boxShadow="xl"
    >
      <Stack as={motion.div} variants={fadeInUp} flexBasis={{ base: "100%", lg: "55%" }} spacing={6}>
        <Heading fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color={headingColor}>
          Your Personal Guide to Better Health
        </Heading>
        <Text fontSize="lg" lineHeight="tall" color={textColor}>
          Ready to feel your best? Our friendly health coaches are here to support you every step of the way. Whether
          you want to boost your energy, eat better, or just feel healthier overall, we&apos;ve got your back!
        </Text>
        <Stack spacing={2}>
          <FeatureItem icon={LuStar} text="Personalized nutrition plans tailored just for you" />
          <FeatureItem icon={LuTarget} text="Achievable goals that fit your lifestyle" />
          <FeatureItem icon={LuHeart} text="Ongoing support to keep you motivated" />
        </Stack>
        <Text fontSize="md" color={textColor}>
          Are you a nutrition pro passionate about helping others? We&apos;d love to have you on our team! Reach out to
          us at{" "}
          <Link color={accentColor} href={"mailto:apply@greenspacedao.xyz"} isExternal fontWeight="semibold">
            apply@greenspacedao.xyz
          </Link>
        </Text>
        <Button
          as={Link}
          href="#get-coach"
          size="lg"
          colorScheme="gs-yellow"
          fontWeight="bold"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          borderRadius="full"
          width={{ base: "100%", sm: "auto" }}
          alignSelf={{ base: "center", sm: "flex-start" }}
        >
          Get Your Health Coach
        </Button>
      </Stack>
      <Box as={motion.div} variants={fadeInUp} flexBasis={{ base: "100%", lg: "40%" }}>
        <Image
          src="/assets/coaching.jpg"
          alt="A health coach providing personalized advice"
          w={"full"}
          h={"full"}
          rounded={"xl"}
          objectFit={"cover"}
          boxShadow="lg"
        />
      </Box>
    </Flex>
  );
}
