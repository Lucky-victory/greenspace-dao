import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Heading, Image, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function CoachArea() {
  const borderColor = useColorModeValue("gs-gray.200", "gs-gray.700");
  const headingColor = useColorModeValue("gs-gray.800", "white");
  const accentColor = useColorModeValue("gs-yellow.500", "gs-yellow.400");
  const textColor = useColorModeValue("gs-gray.600", "gs-gray.300");

  return (
    <Flex
      as={motion.div}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      gap={5}
      borderBottom={"1px"}
      borderBottomColor={borderColor}
      wrap={{ base: "wrap-reverse", md: "nowrap" }}
      mt={12}
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 12 }}
      justify={"space-between"}
    >
      <Stack as={motion.div} variants={fadeInUp} maxW={{ md: 550, base: "auto" }}>
        <Heading mb={5} size={"2xl"} color={headingColor}>
          Get Your Personal
          <Text as={"span"} color={accentColor}>
            {" "}
            Health Coach
          </Text>
        </Heading>
        <Text mb={5} maxW={{ lg: 500, base: "auto" }} lineHeight={"taller"} color={textColor}>
          Looking to level up your health? Our awesome nutritionists are here to give you personal support. Whether
          you&apos;re aiming to lose a few pounds, increase your energy, or just eat healthier, we’re here for you. It’s
          like having a best friend who&apos;s also a nutrition expert!{" "}
        </Text>
        <Text color={textColor}>
          Hey, nutrition pros! Want to join our dream team? Drop us a line at{" "}
          <Link color={accentColor} href={"mailto:apply@greenspacedao.xyz"} isExternal>
            apply@greenspacedao.xyz
          </Link>
          . We&apos;d love to have you on board!
        </Text>
      </Stack>
      <Box as={motion.div} variants={fadeInUp}>
        <Image
          minW={300}
          flexShrink={0}
          src="/assets/coaching.jpg"
          alt="Happy person receiving nutrition coaching"
          maxH={{ base: 350, sm: 450 }}
          maxW={{ base: "auto" }}
          rounded={"20px"}
          objectFit={"cover"}
        />
      </Box>
    </Flex>
  );
}
