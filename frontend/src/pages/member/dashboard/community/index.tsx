import DashboardEmptyArea from "src/components/DashboardEmptyArea";

import {
  Box,
  Button,
  HStack,
  Stack,
  Table,
  TableContainer,
} from "@chakra-ui/react";
import DashBoardLayout from "src/components/MemberDashboardLayout";
import Link from "next/link";
import { useGetCommunitiesQuery } from "src/state/services";
import { usePrivy } from "@privy-io/react-auth";
import isEmpty from "just-is-empty";
import TableItems from "src/components/TableItems";

export default function DashBoard() {
  const { user } = usePrivy();
  const { data: communitiesResponse, isLoading } = useGetCommunitiesQuery({
    userId: user?.id,
  });
  const communities = communitiesResponse?.data;
  return (
    <DashBoardLayout>
      <Box className="min-h-full h-full" px={"4"}>
        <DashboardEmptyArea
          text="You haven't joined any community yet."
          isEmpty={isEmpty(communities)}
          isLoading={isLoading}
        >
          <TableContainer my={5}>
            <Table>
              {communities?.map((community, i) => (
                <TableItems
                  key={"user-comm" + i}
                  keyPrefix="user-communities"
                  dataItem={community}
                />
              ))}
            </Table>
          </TableContainer>
        </DashboardEmptyArea>
        <HStack justify={"center"} my={2}>
          <Button as={Link} size={"lg"} href={"/communities"}>
            Join a community
          </Button>
        </HStack>
      </Box>
    </DashBoardLayout>
  );
}
