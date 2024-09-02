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
  useColorModeValue,
  Tag,
  IconButton
} from "@chakra-ui/react";
import { format } from "date-fns";
import Link from "next/link";
import { LuPencil, LuTrash, LuView } from "react-icons/lu";

interface DataItem {
  Time: string;
  "Meal Name": string;
  Details: string;
  Date: Date;
}

const DynamicTable = ({ data }: { data: DataItem[] }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("green.500", "green.200");
  const theadBgColor = useColorModeValue("gray.300", "gray.800");

  if (!data || data.length === 0) {
    return <Text>No data available</Text>;
  }

  const columns = Object.keys(data[0]).filter(
    (key) => !Array.isArray(data[0][key as keyof DataItem]) && typeof data[0][key as keyof DataItem] !== "object"
  );

  const formatValue = (value: any): string => {
    if (value instanceof Date) {
      return format(value, "yyyy-MM-dd HH:mm:ss");
    }
    return String(value);
  };

  return (
    <TableContainer my={6}>
      <Table rounded={"md"} variant={"striped"} colorScheme="gray">
        <Thead bg={theadBgColor}>
          <Tr>
            {columns.map((column, index) => (
              <Th key={`${column}-${index}`} color={textColor}>
                {column}
              </Th>
            ))}
            <Th color={textColor}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex} my={4}>
              {columns.map((column, colIndex) => (
                <Td key={`${column}-${rowIndex}-${colIndex}`} color={textColor}>
                  {formatValue(row[column as keyof DataItem])}
                </Td>
              ))}
              <Td>
                <Flex gap={2}>
                  <IconButton
                    aria-label="Edit"
                    icon={<LuPencil />}
                    variant={"ghost"}
                    size="sm"
                    onClick={() => {
                      /* Add edit functionality */
                    }}
                  />
                  <IconButton
                    aria-label="Delete"
                    variant={"ghost"}
                    icon={<LuTrash />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => {
                      /* Add delete functionality */
                    }}
                  />
                  <IconButton
                    as={Link}
                    href={`/meal-plan/${rowIndex}`}
                    aria-label="View"
                    icon={<LuView />}
                    variant={"ghost"}
                    size="sm"
                    colorScheme="gray"
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export default function DashBoard() {
  const today = new Date().getTime();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("green.500", "green.200");

  const sampleData: DataItem[] = [
    {
      Time: "Breakfast",
      "Meal Name": "Bread with Chocolate",
      Details: "Bread and chocolate is a great choice...",
      Date: new Date()
    },
    {
      Time: "Lunch",
      "Meal Name": "Fried Rice and Chicken",
      Details: "Fried Rice and Chicken is a great choice...",
      Date: new Date()
    }
  ];

  return (
    <DashBoardLayout>
      <Box minHeight="full" height="full" px={4} mt={6}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={6}>
            <Heading size="md" color={textColor}>
              Your Meal Plans
            </Heading>
            <Tag colorScheme="gs-green" rounded={"full"} fontSize="sm" fontWeight="semibold">
              {format(today, "E, d MMM yyyy")}
            </Tag>
          </Flex>
          <Button
            as={Link}
            href="/meal-plans"
            rounded={"full"}
            bg={accentColor}
            color={bgColor}
            _hover={{ bg: "yellow.400", color: "green.700" }}
          >
            Add Meal Plan
          </Button>
        </Flex>

        <DynamicTable data={sampleData} />
      </Box>
    </DashBoardLayout>
  );
}
