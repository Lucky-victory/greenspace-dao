import { HStack, Text } from "@chakra-ui/react";
import { UserMenu } from "../Auth/UserMenu";

export default function DashboardHeader() {
  return (
    <HStack
      justify={"space-between"}
      borderBottom={"1px"}
      borderBottomColor={"gray.500"}
      bg={"gray.700"}
      px={{ base: 2, md: 4 }}
      py={2}
    >
      <Text as="span">Dashboard</Text>

      <UserMenu />
    </HStack>
  );
}
