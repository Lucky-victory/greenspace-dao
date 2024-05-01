import { Link } from "@chakra-ui/next-js";
import { Box, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { FiFacebook, FiInstagram, FiMail, FiTwitter } from "react-icons/fi";
import { HiX } from "react-icons/hi";

export default function Footer() {
  return (
    <Box minH={150} px={{ base: 4, lg: 12 }} bg={"black"} py={10}>
      <Flex maxW={1250} justify={"space-between"} wrap={"wrap"} gap={5}>
        <Link href={"/"}>
          <Image alt="greenspace logo" src="/white-logo.svg" />
        </Link>
        <Stack>
          <HStack>
            <Link
              href="https://twitter.com/greenspacedao"
              isExternal
              fontSize={24}
              _hover={{ color: "white" }}
            >
              <FiTwitter />
            </Link>
            <Link
              href="https://www.instagram.com/greenspacedao/"
              isExternal
              fontSize={24}
              _hover={{ color: "white" }}
            >
              <FiInstagram />
            </Link>
            <Link
              href="https://www.facebook.com/greenspacedao/"
              isExternal
              fontSize={24}
              _hover={{ color: "white" }}
            >
              <FiFacebook />
            </Link>
            <Link
              href="mailto:support@greenspacedao.xyz"
              isExternal
              fontSize={24}
              _hover={{ color: "white" }}
            >
              <FiMail />
            </Link>
          </HStack>
          <Text as={"span"} fontWeight={500}>
            @greenspacedao
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
}
