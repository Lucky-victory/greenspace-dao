import { Flex } from "@chakra-ui/react";
import PageLoader from "src/components/PageLoader";
import DashboardSideNav from "src/components/DashboardSidebar";
import DashboardHeader from "src/components/DashboardHeader";
import { ReactNode } from "react";
import {
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineSquares2X2,
  HiOutlineCog6Tooth,
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
      nestedChild: [],
    },
    {
      url: "communities",
      title: "Communities",
      icon: HiOutlineUserGroup,
      child: ["new"],
      nestedChild: ["challenges", "events"],
    },
    {
      url: "nutritionists",
      title: "Nutritionists",
      icon: HiOutlineCalendarDays,
      child: [],
      nestedChild: [],
    },
    {
      url: "users",
      title: "Users",
      icon: HiOutlineUser,
      child: ["new"],
      nestedChild: [],
    },
    {
      url: "articles",
      title: "Articles",
      icon: HiOutlineDocumentText,
      child: ["new"],
      nestedChild: [],
    },
    {
      url: "settings",
      title: "Settings",
      icon: HiOutlineCog6Tooth,
      child: [],
      nestedChild: [],
    },
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
