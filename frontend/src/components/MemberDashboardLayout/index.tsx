import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import PageLoader from "../PageLoader";
import DashboardSideNav from "../DashboardSidebar";
import DashboardHeader from "../DashboardHeader";
import { ReactNode } from "react";
import { HiOutlineCog6Tooth, HiOutlineListBullet, HiOutlineSquares2X2 } from "react-icons/hi2";
import { HiAcademicCap, HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const navLinks = [
    {
      url: "overview",
      title: "Overview",
      icon: HiOutlineSquares2X2,
      child: []
    },
    {
      url: "nutritionists",
      title: "Nutritionists",
      icon: HiOutlineUserCircle,
      child: []
    },
    {
      url: "ai-coach",
      title: "AI Coach",
      icon: HiAcademicCap,
      child: []
    },
    {
      url: "my-meal-plans",
      title: "My Meal Plans",
      icon: HiOutlineListBullet,
      child: []
    },
    {
      url: "community",
      title: "Community",
      icon: HiOutlineUserGroup,
      child: []
    },
    {
      url: "settings",
      title: "Settings",
      icon: HiOutlineCog6Tooth,
      child: []
    }
  ];

  return (
    <PageLoader>
      <Flex
        mx={"auto"}
        maxW={"1350px"}
        h={"var(--chakra-vh,100vh)"}
        minH={600}
        maxH={700}
        bg={bgColor}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
      >
        <DashboardSideNav links={navLinks} entryPath="/member/dashboard/" />
        <Flex direction={"column"} h={"full"} flex={1} overflowY={"auto"} borderLeft={`1px solid ${borderColor}`}>
          <DashboardHeader />
          <Box p={4} flex={1}>
            {children}
          </Box>
        </Flex>
      </Flex>
    </PageLoader>
  );
}
