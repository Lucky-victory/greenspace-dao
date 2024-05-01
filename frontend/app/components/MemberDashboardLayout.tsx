import { Box, Flex } from "@chakra-ui/react";
import PageLoader from "./PageLoader";
import DashboardSideNav from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { ReactNode } from "react";
import {
  MdOutlineFastfood,
  MdOutlinePostAdd,
  MdOutlineSettings,
  MdOutlineDashboard,
} from "react-icons/md";
import {
  HiOutlineCog6Tooth,
  HiOutlineListBullet,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import {
  HiAcademicCap,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
} from "react-icons/hi";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navLinks = [
    {
      url: "overview",
      title: "Overview",
      icon: HiOutlineSquares2X2,
      child: [],
    },
    {
      url: "nutritionists",
      title: "Nutritionists",
      icon: HiOutlineUserCircle,
      child: [],
    },
    {
      url: "ai-coach",
      title: "AI Coach",
      icon: HiAcademicCap,
      child: [],
    },
    {
      url: "my-meal-plans",
      title: "My Meal Plans",
      icon: HiOutlineListBullet,
      child: [],
    },
    {
      url: "community",
      title: "Community",
      icon: HiOutlineUserGroup,
      child: [],
    },
    {
      url: "settings",
      title: "Settings",
      icon: HiOutlineCog6Tooth,
      child: [],
    },
  ];
  return (
    <PageLoader>
      <Flex
        mx={"auto"}
        maxW={"1350"}
        h={"var(--chakra-vh,100vh)"}
        minH={600}
        maxH={700}
        bg={"black"}
      >
        <DashboardSideNav links={navLinks} entryPath="/member/dashboard/" />
        <Flex
          direction={"column"}
          h={"full"}
          flex={1}
          // w={"full"}
          overflowY={"auto"}
        >
          <DashboardHeader />
          {children}
        </Flex>
      </Flex>
    </PageLoader>
  );
}
