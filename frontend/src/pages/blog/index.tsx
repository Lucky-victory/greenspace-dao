import ArticleCard from "src/components/ArticleCard";
import Footer from "src/components/Footer";
import { HeaderNav } from "src/components/HeaderNav";
import { useGetArticlesQuery } from "src/state/services";
import { type Article as IArticle } from "src/types/shared";
import {
  Box,
  HStack,
  Heading,
  Skeleton,
  Flex,
  LinkBox,
  Image,
  Text,
  LinkOverlay,
  useColorModeValue,
  Stack
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { format } from "date-fns";

const MAX_CHARACTER_LENGTH = 150;

const shortenText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const BlogPage = () => {
  const { data, isFetching, isLoading } = useGetArticlesQuery({});
  const articles = data?.data as IArticle[];

  const bgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.700", "white");
  const metaColor = useColorModeValue("gray.600", "gray.400");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <>
      <Head>
        <title>GreenspaceDAO | Blog</title>
      </Head>
      <Box as="main" className="min-h-screen" px={{ lg: 5, base: 4 }} pt={"var(--navbar-height)"}>
        <HeaderNav />
        <Box maxW={"1350px"} mx={"auto"}>
          <Heading mt={5} mb={1}>
            Recent Posts
          </Heading>
          <Flex wrap={"wrap"} align={"stretch"} justify={"flex-start"} gap={6} mx={"auto"} my={6} py={4}>
            {(isFetching || isLoading) && (
              <>
                {[0, 1, 2, 3].map((_, i) => (
                  <Stack bg={bgColor} w={300} key={"skeleton" + i} rounded={"lg"}>
                    <Skeleton height="200px" rounded={"lg"} />
                    <Box p={6}>
                      <Skeleton height="24px" width="80%" mb={2} rounded={"lg"} />
                      <Skeleton height="16px" mb={4} rounded={"lg"} />
                      <Skeleton height="16px" width="60%" mb={2} rounded={"lg"} />
                      <Skeleton height="16px" width="40%" rounded={"lg"} />
                    </Box>
                  </Stack>
                ))}
              </>
            )}
            {!isLoading &&
              articles?.length &&
              articles.map((article) => <ArticleCard article={article} key={article.id} />)}
          </Flex>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default BlogPage;
