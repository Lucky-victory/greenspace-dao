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
import NutritionistDashBoardLayout from "@/components/NutritionistDashboardLayout";
import Head from "next/head";
import { Link } from "@chakra-ui/next-js";
import { useGetArticlesQuery } from "@/state/services";
import { removeKeyFromObject, selectObjectKeys } from "@/utils";
import { Article } from "@/types/shared";
import TableItems from "@/components/TableItems";
import isEmpty from "just-is-empty";
import DashboardEmptyArea from "@/components/DashboardEmptyArea";

export default function ArticlesDashBoard() {
  const { data, isLoading, isFetching } = useGetArticlesQuery({
    status: "all",
  });
  const articles = removeKeyFromObject(data?.data || ([] as Article[]), [
    "author",
  ]);
  console.log({ _data: articles });

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
        <title>Dashboard | Articles</title>
      </Head>
      <NutritionistDashBoardLayout>
        <Box className="min-h-full h-full px-4 mt-6">
          {" "}
          <Flex align={"center"} justify={"space-between"}>
            <Flex align={"center"} gap={6}>
              <Heading size={"lg"}>Articles</Heading>{" "}
            </Flex>
            <Button
              as={Link}
              href={"articles/new"}
              //   className="bg-primaryGreen text-primaryBeige hover:bg-primaryYellowTrans hover:text-primaryGreen"
            >
              Create Post
            </Button>
          </Flex>
          <DashboardEmptyArea
            text=" You don't have any articles yet."
            isEmpty={!articles?.length}
            isLoading={isLoading || isFetching}
          >
            {!isEmpty(articles) && (
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
                borderColor={"gray.700"}
                // rounded={'14px'}
                bg={"gray.800"}
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
                        {!isEmpty(articles) &&
                          selectObjectKeys(articles[0]).map((key, i) => {
                            return (
                              <Th key={"article-th" + key} {...tableHeadStyles}>
                                {key}
                              </Th>
                            );
                          })}

                        <Th {...tableHeadStyles} key={"article-th-actions"}>
                          Actions
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody className="files-table-body">
                      {!isEmpty(articles) &&
                        articles.map((d, i) => (
                          <Tr key={"article-item" + d.id + i}>
                            <TableItems keyPrefix={"article"} dataItem={d} />
                            <Td>
                              <HStack>
                                <Button
                                  href={"/blog/article/" + d.slug}
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
          </DashboardEmptyArea>
        </Box>
        ;
      </NutritionistDashBoardLayout>
    </>
  );
}
