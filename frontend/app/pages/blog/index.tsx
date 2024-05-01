import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import { HeaderNav } from "@/components/HeaderNav";
import { useGetArticlesQuery } from "@/state/services";
import { type Article as IArticle } from "@/types/shared";
import { Box, HStack, Heading, Skeleton, Flex } from "@chakra-ui/react";
import Head from "next/head";

const BlogPage = () => {
  const { data, isFetching, isLoading } = useGetArticlesQuery({});
  const articles = data?.data as IArticle[];
  return (
    <>
      <Box as="main" className="min-h-screen" px={{ lg: 5, base: 4 }}>
        <Head>
          <title>Rejuvenate AI | Blog</title>
        </Head>
        <HeaderNav />
        <Box maxW={"1200px"} mx={"auto"}>
          <Heading mt={5} mb={1}>
            Recent Post
          </Heading>
          <HStack
            wrap={"wrap"}
            align={"initial"}
            justify={"initial"}
            gap={4}
            mx={"auto"}
            my={6}
            py={4}
            // px={{ base: 3, lg: 0 }}
          >
            {(isFetching || isLoading) && (
              <Flex wrap={"wrap"} gap={5}>
                {[0, 0, 0, 0].map((s, i) => (
                  <Skeleton
                    key={"skelon" + i}
                    w={300}
                    h={350}
                    rounded={"sm"}
                  ></Skeleton>
                ))}
              </Flex>
            )}
            {!isLoading &&
              articles?.length &&
              articles.map((article) => (
                <ArticleCard key={article?.id} article={article} />
              ))}
          </HStack>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default BlogPage;
