import { Box, Flex } from "@chakra-ui/react";
import PageLoader from "./PageLoader";
import DashboardSideNav from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <PageLoader>
      <Flex mx={"auto"} maxW={"1350"}>
        <DashboardSideNav />
        <Flex direction={"column"}>
          <DashboardHeader />
          {children}
        </Flex>
      </Flex>
    </PageLoader>
  );
}
