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
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navLinks = [
    { url: "overview", title: "Overview", icon: MdOutlineDashboard, child: [] },
    {
      url: "meal-plans",
      title: "Meal Plans",
      icon: MdOutlineFastfood,
      child: ["new"],
    },
    {
      url: "fitness-plans",
      title: "Fitness Plans",
      icon: MdOutlineFastfood,
      child: ["new"],
    },
    {
      url: "articles",
      title: "Articles",
      icon: MdOutlinePostAdd,
      child: ["new"],
    },
    {
      url: "appointments",
      title: "Appointments",
      icon: MdOutlineFastfood,
      child: [],
    },
    { url: "settings", title: "Settings", icon: MdOutlineSettings, child: [] },
  ];
  return (
    <PageLoader>
      <Flex
        mx={"auto"}
        maxW={"1350"}
        h={"var(--chakra-vh,100vh)"}
        minH={600}
        bg={"gs-yellow.900"}
      >
        <DashboardSideNav
          links={navLinks}
          entryPath="/nutritionist/dashboard/"
        />
        <Flex direction={"column"} bg={"gs-gray.100"} h={"full"}>
          <DashboardHeader />
          {children}
        </Flex>
      </Flex>
    </PageLoader>
  );
}
