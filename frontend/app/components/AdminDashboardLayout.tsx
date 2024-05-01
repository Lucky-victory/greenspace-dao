import { Box, Flex } from "@chakra-ui/react";
import PageLoader from "./PageLoader";
import DashboardSideNav from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { ReactNode } from "react";
import {
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineSquares2X2,
  HiOutlineCog6Tooth,
  HiOutlinePresentationChartLine,
  HiOutlineLightBulb,
  HiOutlineUserGroup,
  HiOutlineUser,
} from "react-icons/hi2";
export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const navLinks = [
    {
      url: "overview",
      title: "Overview",
      icon: HiOutlineSquares2X2,
      child: [],
    },
    {
      url: "communities",
      title: "Communities",
      icon: HiOutlineUserGroup,
      child: ["new"],
    },
    {
      url: "nutritionists",
      title: "Nutritionists",
      icon: HiOutlineCalendarDays,
      child: [],
    },
    {
      url: "users",
      title: "Users",
      icon: HiOutlineUser,
      child: ["new"],
    },
    {
      url: "articles",
      title: "Articles",
      icon: HiOutlineDocumentText,
      child: ["new"],
    },
    { url: "settings", title: "Settings", icon: HiOutlineCog6Tooth, child: [] },
  ];
  return (
    <PageLoader>
      <Flex
        mx={"auto"}
        maxW={"1350"}
        h={"var(--chakra-vh,100vh)"}
        minH={600}
        bg={"black"}
        // overflowY={"auto"}
        maxH={700}
      >
        <DashboardSideNav links={navLinks} entryPath="/admin/dashboard/" />
        <Flex direction={"column"} flex={1} overflowY={"auto"}>
          <DashboardHeader />
          {children}
        </Flex>
      </Flex>
    </PageLoader>
  );
}
