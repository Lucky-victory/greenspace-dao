import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashboardLayout from "src/components/AdminDashboardLayout";
import { Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import PageLoader from "src/components/PageLoader";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <PageLoader isLoading={isLoading}>
      <Head>
        <title>Admin Dashboard | Overview</title>
      </Head>
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
    </PageLoader>
  );
}
