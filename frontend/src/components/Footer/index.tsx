import { Link } from "@chakra-ui/next-js";
import { Box, Flex, HStack, Image, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { FiFacebook, FiInstagram, FiMail, FiTwitter } from "react-icons/fi";

export default function Footer() {
  const bgColor = useColorModeValue("gray.100", "black");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverColor = useColorModeValue("black", "white");
  const logoSrc = useColorModeValue("/black-logo.svg", "/white-logo.svg");

  return (
    <Box minH={150} px={{ base: 4, lg: 12 }} bg={bgColor} py={10}>
      <Flex maxW={1250} justify={"space-between"} wrap={"wrap"} gap={5}>
        <Link href={"/"}>
          <Image alt="greenspace logo" src={logoSrc} />
        </Link>
        <Stack>
          <HStack>
            <Link
              href="https://twitter.com/greenspacedao"
              isExternal
              fontSize={24}
              color={textColor}
              _hover={{ color: hoverColor }}
            >
              <FiTwitter />
            </Link>
            <Link
              href="https://www.instagram.com/greenspacedao/"
              isExternal
              fontSize={24}
              color={textColor}
              _hover={{ color: hoverColor }}
            >
              <FiInstagram />
            </Link>
            <Link
              href="https://www.facebook.com/greenspacedao/"
              isExternal
              fontSize={24}
              color={textColor}
              _hover={{ color: hoverColor }}
            >
              <FiFacebook />
            </Link>
            <Link
              href="mailto:support@greenspacedao.xyz"
              isExternal
              fontSize={24}
              color={textColor}
              _hover={{ color: hoverColor }}
            >
              <FiMail />
            </Link>
          </HStack>
          <Text as={"span"} fontWeight={500} color={textColor}>
            @greenspacedao
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
}
