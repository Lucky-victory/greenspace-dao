import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashBoardLayout from "src/components/MemberDashboardLayout";

import Icon from "src/components/Icon";
import { Link } from "@chakra-ui/next-js";
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
  Avatar,
} from "@chakra-ui/react";
import { format } from "date-fns";
export default function DashBoard() {
  const today = new Date().getTime();
  return (
    <DashBoardLayout>
      <Box className="min-h-full h-full px-4 mt-6">
        <Flex align={"center"} justify={"space-between"}>
          <Flex align={"center"} gap={6}>
            <Heading size={"lg"}>Today&apos;s Appointments</Heading>{" "}
            <Text
              className="bg-primaryGreen text-white rounded-full py-1 px-4 "
              fontSize={"sm"}
              fontWeight={"semibold"}
            >
              {format(today, "E, d MMM yyyy")}
            </Text>
          </Flex>
          {/* <Button className="bg-primaryGreen text-primaryBeige hover:bg-primaryYellowTrans hover:text-primaryGreen">Create Meal Plan</Button> */}
        </Flex>

        <TableContainer my={6}>
          <Table>
            <Thead bg={"gray.800"} className="mb-4">
              <Tr>
                <Th>Name</Th>
                <Th>Time</Th>
                <Th>Duration</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr bg={"gray.800"} rounded={"md"} my={4}>
                <Td>
                  {" "}
                  <Flex align={"center"} gap={3}>
                    <Avatar
                      size={"sm"}
                      rounded={"md"}
                      src="/images/user-59.jpg"
                    />{" "}
                    <Text as={"span"} fontWeight={"semibold"}>
                      Lilian James
                    </Text>
                  </Flex>
                </Td>
                <Td>7:45 - 8:30 AM GMT+1</Td>
                <Td>45 MINS</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size={"sm"}
                      rounded={"full"}
                      gap={2}
                      className="hover:bg-primaryYellow hover:text-primaryGreen text-primaryBeige bg-primaryGreen"
                    >
                      <Icon size={20} name="phone" /> Start Call
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      rounded={"full"}
                      className="text-primaryGreen"
                    >
                      View Details
                    </Button>
                  </Flex>
                </Td>
              </Tr>
              <Tr bg={"gray.800"} rounded={"md"} my={4}>
                <Td>
                  <Flex align={"center"} gap={3}>
                    <Avatar
                      size={"sm"}
                      rounded={"md"}
                      src="/images/user-53.jpg"
                    />
                    <Text as={"span"} fontWeight={"semibold"}>
                      Chris Eze
                    </Text>
                  </Flex>{" "}
                </Td>
                <Td>12:30 - 1:00 PM GMT+1</Td>
                <Td>30 MINS</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size={"sm"}
                      rounded={"full"}
                      gap={2}
                      className="hover:bg-primaryYellow hover:text-primaryGreen text-primaryBeige bg-primaryGreen"
                    >
                      <Icon size={20} name="phone" /> Start Call
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      rounded={"full"}
                      className="text-primaryGreen"
                    >
                      View Details
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>

        <Box my={6}>
          <Heading size={"lg"}>Upcoming Appointments</Heading>
          <Flex
            bg={"gray.800"}
            minH={220}
            align={"center"}
            justify={"center"}
            mt={4}
          >
            <Flex direction={"column"}>
              <Text
                fontSize={18}
                className="text-secondaryGray"
                fontWeight={"semibold"}
              >
                No upcoming appointments
              </Text>
              <Button
                as={Link}
                href={"/nutritionists"}
                mt={6}
                size={"lg"}
                // className="bg-primaryGreen text-primaryBeige hover:text-primaryGreen hover:bg-primaryYellow"
              >
                Book a Nutritionist
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </DashBoardLayout>
  );
}
