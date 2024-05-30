import { Flex, Heading } from "@chakra-ui/react";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashboardLayout from "src/components/AdminDashboardLayout";
export default function ArticlesPage() {
  return (
    <DashboardLayout>
      <Flex direction={"column"} w={"full"} py={5} px={4}>
        <Heading mb={2}>Articles</Heading>
        <DashboardEmptyArea
          text="No Articles yet"
          isEmpty={true}
          isLoading={false}
        ></DashboardEmptyArea>
      </Flex>
    </DashboardLayout>
  );
}
