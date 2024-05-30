import { Box, Flex, Heading } from "@chakra-ui/react";
import NutritionistDashBoardLayout from "src/components/NutritionistDashboardLayout";
import Head from "next/head";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";

export default function DashBoard() {
  return (
    <>
      <Head>
        <title>Dashboard | Settings</title>
      </Head>
      <NutritionistDashBoardLayout>
        <Box className="min-h-full h-full">
          <Flex direction={"column"} w={"full"} py={5} px={4}>
            <Heading mb={2}>Settings</Heading>
            <DashboardEmptyArea
              text="No data yet"
              isEmpty={true}
              isLoading={false}
            ></DashboardEmptyArea>
          </Flex>
        </Box>
      </NutritionistDashBoardLayout>
    </>
  );
}
