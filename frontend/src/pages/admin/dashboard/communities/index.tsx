import { Button, Flex, HStack, Heading } from "@chakra-ui/react";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashboardLayout from "src/components/AdminDashboardLayout";
import { Link } from "@chakra-ui/next-js";
import { FiPlus } from "react-icons/fi";
export default function CommunitiesPage() {
  return (
    <DashboardLayout>
      <Flex direction={"column"} w={"full"} py={5} px={4}>
        <HStack justify={"space-between"}>
          <Heading mb={2}>Communities</Heading>
          <Button
            as={Link}
            href={"./communities/new"}
            colorScheme="gs-yellow"
            rounded={"full"}
            gap={2}
          >
            <FiPlus size={20} />
            New Community
          </Button>
        </HStack>
        <DashboardEmptyArea
          text="No Communities yet"
          isEmpty={true}
          isLoading={false}
        ></DashboardEmptyArea>
      </Flex>
    </DashboardLayout>
  );
}
