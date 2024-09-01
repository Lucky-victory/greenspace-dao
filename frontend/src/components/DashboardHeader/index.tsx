import { HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { UserMenu } from "../Auth/UserMenu";

export default function DashboardHeader() {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <HStack
      justify={"space-between"}
      borderBottom={"1px"}
      borderBottomColor={borderColor}
      bg={bgColor}
      px={{ base: 2, md: 4 }}
      py={2}
    >
      <Text as="span" color={textColor}>
        Dashboard
      </Text>

      <UserMenu />
    </HStack>
  );
}
