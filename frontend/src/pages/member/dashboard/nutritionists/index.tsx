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
  useColorModeValue
} from "@chakra-ui/react";
import { format } from "date-fns";
import { BsPhone } from "react-icons/bs";

export default function DashBoard() {
  const today = new Date().getTime();
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const buttonBg = useColorModeValue("green.500", "green.200");
  const buttonColor = useColorModeValue("white", "gray.800");
  const buttonHoverBg = useColorModeValue("green.600", "green.300");
  const outlineButtonColor = useColorModeValue("green.500", "green.200");

  return (
    <DashBoardLayout>
      <Box className="min-h-full h-full px-4 mt-6">
        <Flex align={"center"} justify={"space-between"}>
          <Flex align={"center"} gap={6}>
            <Heading size={"lg"} color={textColor}>
              Today&apos;s Appointments
            </Heading>{" "}
            <Text
              bg={buttonBg}
              color={buttonColor}
              rounded={"full"}
              py={1}
              px={4}
              fontSize={"sm"}
              fontWeight={"semibold"}
            >
              {format(today, "E, d MMM yyyy")}
            </Text>
          </Flex>
        </Flex>

        <TableContainer my={6}>
          <Table>
            <Thead bg={headerBg} rounded={"md"}>
              <Tr>
                <Th color={textColor}>Name</Th>
                <Th color={textColor}>Time</Th>
                <Th color={textColor}>Duration</Th>
                <Th color={textColor}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr bg={bg} rounded={"md"} my={4} boxShadow="sm">
                <Td>
                  <Flex align={"center"} gap={3}>
                    <Avatar size={"sm"} rounded={"full"} src="/images/user-59.jpg" />
                    <Text as={"span"} fontWeight={"semibold"} color={textColor}>
                      Lilian James
                    </Text>
                  </Flex>
                </Td>
                <Td color={textColor}>7:45 - 8:30 AM GMT+1</Td>
                <Td color={textColor}>45 MINS</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size={"sm"}
                      rounded={"full"}
                      gap={2}
                      bg={buttonBg}
                      color={buttonColor}
                      _hover={{ bg: buttonHoverBg }}
                    >
                      <BsPhone size={20} name="phone" /> Start Call
                    </Button>
                    <Button size={"sm"} variant={"outline"} rounded={"full"} color={outlineButtonColor}>
                      View Details
                    </Button>
                  </Flex>
                </Td>
              </Tr>
              <Tr bg={bg} rounded={"md"} my={4} boxShadow="sm">
                <Td>
                  <Flex align={"center"} gap={3}>
                    <Avatar size={"sm"} rounded={"full"} src="/images/user-53.jpg" />
                    <Text as={"span"} fontWeight={"semibold"} color={textColor}>
                      Chris Eze
                    </Text>
                  </Flex>
                </Td>
                <Td color={textColor}>12:30 - 1:00 PM GMT+1</Td>
                <Td color={textColor}>30 MINS</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size={"sm"}
                      rounded={"full"}
                      gap={2}
                      bg={buttonBg}
                      color={buttonColor}
                      _hover={{ bg: buttonHoverBg }}
                    >
                      <BsPhone size={20} name="phone" /> Start Call
                    </Button>
                    <Button size={"sm"} variant={"outline"} rounded={"full"} color={outlineButtonColor}>
                      View Details
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>

        <Box my={6}>
          <Heading size={"lg"} color={textColor}>
            Upcoming Appointments
          </Heading>
          <Flex bg={bg} minH={220} align={"center"} justify={"center"} mt={4} rounded={"lg"} boxShadow="md">
            <Flex direction={"column"}>
              <Text fontSize={18} color={useColorModeValue("gray.600", "gray.400")} fontWeight={"semibold"}>
                No upcoming appointments
              </Text>
              <Button
                as={Link}
                href={"/nutritionists"}
                mt={6}
                size={"lg"}
                bg={buttonBg}
                color={buttonColor}
                _hover={{ bg: buttonHoverBg }}
                rounded={"full"}
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
