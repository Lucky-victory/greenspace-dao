import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Image,
  Tr,
  ResponsiveValue,
} from "@chakra-ui/react";
import NutritionistDashBoardLayout from "src/components/NutritionistDashboardLayout";
import Head from "next/head";
import { Link } from "@chakra-ui/next-js";
import { useGetFitnessPlansQuery } from "src/state/services";
import { removeKeyFromObject, selectObjectKeys } from "src/utils";
import { FitnessPlan } from "src/types/shared";
import TableItems from "src/components/TableItems";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";

export default function ArticlesDashBoard() {
  const { data, isLoading, isFetching } = useGetFitnessPlansQuery({
    status: "all",
  });
  const _data = removeKeyFromObject(data?.data || ([] as FitnessPlan[]), [
    "author",
  ]);
  const tableHeadStyles = {
    // pb: 4,
    fontSize: "15px",
    fontWeight: "medium",
    textTransform: "uppercase" as ResponsiveValue<"capitalize">,
    // color: '#9CA4AB',
  };
  return (
    <>
      <Head>
        <title>Dashboard | Fitness Plans</title>
      </Head>
      <NutritionistDashBoardLayout>
        <Box className="min-h-full h-full px-4 mt-6">
          {" "}
          <Flex align={"center"} justify={"space-between"}>
            <Flex align={"center"} gap={6}>
              <Heading size={"lg"}>Fitness Plans</Heading>{" "}
            </Flex>
            <Button
              as={Link}
              href={"fitness-plans/new"}
              // className="bg-primaryGreen text-primaryBeige hover:bg-primaryYellowTrans hover:text-primaryGreen"
            >
              Create a plan
            </Button>
          </Flex>
          {!_data || !_data?.length ? (
            <DashboardEmptyArea
              text="No Posts yet"
              isEmpty={true}
              isLoading={false}
            ></DashboardEmptyArea>
          ) : (
            <Box
              my={8}
              maxW={"full"}
              minW={{ xl: "350px", base: "100%" }}
              px={5}
              py={4}
              w={{ base: "full" }}
              flex={1}
              alignSelf={"flex-start"}
              // h={"442px"}
              border={"1px"}
              borderColor={"gray.300"}
              // rounded={'14px'}
              bg={"white"}
              //   pos={"relative/"}
            >
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr
                      h={"auto"}
                      borderBottom={"2px"}
                      borderBottomColor={"gray.100"}
                    >
                      {_data &&
                        selectObjectKeys(_data[0]).map((key, i) => {
                          return (
                            <Th key={"fitness-th" + key} {...tableHeadStyles}>
                              {key}
                            </Th>
                          );
                        })}
                      <Th {...tableHeadStyles} key={"fitness-th-actions"}>
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody className="files-table-body">
                    {_data &&
                      _data.map((d, i) => (
                        <Tr key={"fitness-data" + i}>
                          <TableItems keyPrefix={"fitness"} dataItem={d} />
                          <Td>
                            <HStack>
                              <Button
                                href={"/fitness-plans/" + d.slug}
                                variant={"outline"}
                                as={Link}
                                size={"sm"}
                                textDecor={"none"}
                                rounded={"full"}
                              >
                                View
                              </Button>
                              <Button
                                size={"sm"}
                                href={"./articles/edit?pid=" + d.id}
                                variant={"outline"}
                                as={Link}
                                textDecor={"none"}
                                rounded={"full"}
                              >
                                Edit
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
        ;
      </NutritionistDashBoardLayout>
    </>
  );
}
