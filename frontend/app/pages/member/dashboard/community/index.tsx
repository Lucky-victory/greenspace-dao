import DashboardEmptyArea from "@/components/DashboardEmptyArea";

import { Box, Button, HStack, Stack } from "@chakra-ui/react";
import DashBoardLayout from "@/components/MemberDashboardLayout";
import Link from "next/link";

export default function DashBoard() {
  return (
    <DashBoardLayout>
      <Box className="min-h-full h-full" px={"4"}>
        <DashboardEmptyArea
          text="  You haven't joined any community yet."
          isEmpty={true}
          isLoading={false}
        ></DashboardEmptyArea>
        <HStack justify={"center"}>
          <Button as={Link} size={"lg"} href={"/communities"}>
            Join a community
          </Button>
        </HStack>
      </Box>
    </DashBoardLayout>
  );
}
