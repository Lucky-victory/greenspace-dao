import DashboardEmptyArea from "@/components/DashboardEmptyArea";
import DashboardLayout from "@/components/MemberDashboardLayout";
import { Flex, Heading } from "@chakra-ui/react";

export default function MemberDashboardPage() {
  return (
    <DashboardLayout>
      <Flex direction={"column"} w={"full"} py={5} px={4}>
        <Heading>Settings</Heading>
        <DashboardEmptyArea
          text="No data to show"
          isEmpty={true}
          isLoading={false}
        ></DashboardEmptyArea>
      </Flex>
    </DashboardLayout>
  );
}
