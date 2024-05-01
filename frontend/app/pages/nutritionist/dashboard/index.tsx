import DashboardEmptyArea from "@/components/DashboardEmptyArea";
import DashboardLayout from "@/components/NutritionistDashboardLayout";
import { Flex, Heading } from "@chakra-ui/react";

export default function NutritionistDashboardPage() {
  return (
    <DashboardLayout>
      <Flex direction={"column"} w={"full"} py={5} px={4}>
        <Heading mb={2}>Activity</Heading>
        <DashboardEmptyArea
          text="No Activity yet"
          isEmpty={true}
          isLoading={false}
        ></DashboardEmptyArea>
      </Flex>
    </DashboardLayout>
  );
}
