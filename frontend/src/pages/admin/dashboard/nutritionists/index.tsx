import { Flex, Heading } from "@chakra-ui/react";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashboardLayout from "src/components/AdminDashboardLayout";
export default function NutritionistsPage() {
  return (
    <DashboardLayout>
      <Flex direction={"column"} w={"full"} py={5} px={4}>
        <Heading mb={2}>Nutritionists</Heading>
        <DashboardEmptyArea
          text="No Nutritionist yet"
          isEmpty={true}
          isLoading={false}
        ></DashboardEmptyArea>
      </Flex>
    </DashboardLayout>
  );
}
