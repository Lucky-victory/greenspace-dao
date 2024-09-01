import { Link } from "@chakra-ui/next-js";
import { Box, Flex, Grid, HStack, Image, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { FiFacebook, FiInstagram, FiMail, FiTwitter } from "react-icons/fi";

export default function Footer() {
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverColor = useColorModeValue("blue.500", "blue.300");
  const logoSrc = useColorModeValue("/black-logo.svg", "/white-logo.svg");

  const socialLinks = [
    { href: "https://twitter.com/greenspacedao", icon: FiTwitter },
    { href: "https://www.instagram.com/greenspacedao/", icon: FiInstagram },
    { href: "https://www.facebook.com/greenspacedao/", icon: FiFacebook },
    { href: "mailto:support@greenspacedao.xyz", icon: FiMail }
  ];

  const footerLinks = [
    { title: "About Us", href: "/about" },
    { title: "Meal Plans", href: "/meal-plans" },
    { title: "Communities", href: "/communities" },
    { title: "Nutritionists", href: "/nutritionists" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" }
  ];

  return (
    <Box bg={bgColor} py={10}>
      <Flex maxW={1250} mx="auto" px={{ base: 4, lg: 12 }} direction="column">
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "2fr 1fr 1fr" }} gap={8} mb={8}>
          <VStack align="flex-start" spacing={4}>
            <Link href="/">
              <Image alt="greenspace logo" src={logoSrc} h="40px" />
            </Link>
            <Text color={textColor}>
              GreenSpace is committed to improving people&apos;s health and helping them live longer through
              personalized meal plans, community support, and expert nutritionist guidance.
            </Text>
            <HStack spacing={4}>
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  isExternal
                  fontSize={20}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                >
                  <link.icon />
                </Link>
              ))}
            </HStack>
          </VStack>
          <VStack align="flex-start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" mb={2} color={textColor}>
              Quick Links
            </Text>
            {footerLinks.slice(0, 4).map((link, index) => (
              <Link key={index} href={link.href} color={textColor} _hover={{ color: hoverColor }}>
                {link.title}
              </Link>
            ))}
          </VStack>
          <VStack align="flex-start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" mb={2} color={textColor}>
              Legal
            </Text>
            {footerLinks.slice(4).map((link, index) => (
              <Link key={index} href={link.href} color={textColor} _hover={{ color: hoverColor }}>
                {link.title}
              </Link>
            ))}
          </VStack>
        </Grid>
        <Box borderTop="1px" borderColor={useColorModeValue("gray.200", "gray.700")} pt={4}>
          <Text textAlign="center" fontSize="sm" color={textColor}>
            © {new Date().getFullYear()} GreenSpace. All rights reserved.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
