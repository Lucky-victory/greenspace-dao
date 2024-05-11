import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashBoardLayout from "src/components/MemberDashboardLayout";

import {
  Td,
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Link from "next/link";
export default function DashBoard() {
  const today = new Date().getTime();
  return (
    <DashBoardLayout>
      <Box className="min-h-full h-full px-4 mt-6">
        <Flex align={"center"} justify={"space-between"}>
          <Flex align={"center"} gap={6}>
            <Heading size={"lg"}>Your Meal Plans</Heading>{" "}
            <Text
              className="bg-primaryGreen text-white rounded-full py-1 px-4 "
              fontSize={"sm"}
              fontWeight={"semibold"}
            >
              {format(today, "E, d MMM yyyy")}
            </Text>
          </Flex>
          <Button
            as={Link}
            href={"/meal-plans"}
            // className="bg-primaryGreen text-primaryBeige hover:bg-primaryYellow hover:text-primaryGreen"
          >
            Add Meal Plan
          </Button>
        </Flex>

        <TableContainer my={6}>
          <Table>
            <Thead bg={"gray.800"} className="mb-4">
              <Tr>
                <Th>Time</Th>
                <Th>Meal Name</Th>
                <Th>Details</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr bg={"gray.800"} rounded={"md"} my={4}>
                <Td>Breakfast</Td>
                <Td>Bread with Chocolate</Td>
                <Td minW={"300"} maxW={400}>
                  Bread and chocolate is a great choice...
                </Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      rounded={"full"}
                      // className="text-primaryGreen border-primaryGreen"
                    >
                      View Details
                    </Button>
                  </Flex>
                </Td>
              </Tr>
              <Tr bg={"gray.800"} rounded={"md"} my={4}>
                <Td>Lunch</Td>
                <Td>Fried Rice and Chicken</Td>
                <Td minW={"200px"} maxW={350}>
                  Fried Rice and Chicken is a great choice...
                </Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      rounded={"full"}
                      // className="text-primaryGreen border-primaryGreen"
                    >
                      View Details
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </DashBoardLayout>
  );
}
