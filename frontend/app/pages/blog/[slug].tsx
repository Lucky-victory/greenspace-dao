import MarkdownRenderer from "@/components/MarkdownRenderer";
import Footer from "@/components/Footer";
import { HeaderNav } from "@/components/HeaderNav";
import { maskHexAddress, resolveIPFSURI } from "@/helpers";
import { useGetArticleQuery } from "@/state/services";
import {
  Box,
  HStack,
  Text,
  Avatar,
  Heading,
  Image,
  Stack,
  Flex,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";
import { format } from "date-fns";
import isEmpty from "just-is-empty";
import Head from "next/head";
import { useRouter } from "next/router";

const ArticleView = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, isLoading, isFetching } = useGetArticleQuery({
    slug: slug as string,
  });
  const article = data?.data;

  return (
    <>
      <Head>
        <title>{article?.title}</title>
        <meta name="description" content={article?.intro} />
        <meta property="og:title" content={article?.title} />

        <meta property="og:description" content={article?.intro} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://greenspacedao.xyz/blog/${article?.slug}`}
        />
        <meta property="og:image" content={article?.image} />
      </Head>
      <HeaderNav />
      <Box py={8}>
        <Box
          // bg={"white"}
          maxW={"1200px"}
          mx={"auto"}
          minH={"100vh"}
          px={{ lg: 6, base: 4 }}
          py={6}
        >
          <Box maxW={"1000px"} mx={"auto"}>
            <Stack spacing={4} mb={6}>
              <Box>
                <Skeleton
                  mb={2}
                  minH={"50px"}
                  isLoaded={!isLoading && !isFetching && !isEmpty(article)}
                >
                  <Heading mb={5} as={"h1"}>
                    {article?.title}
                  </Heading>
                </Skeleton>
                <HStack
                  borderY={"1px"}
                  borderColor={"gray.600"}
                  my={4}
                  py={2}
                  spacing={"4"}
                  mb={8}
                >
                  {isLoading || isFetching ? (
                    <SkeletonCircle
                      minH={"65px"}
                      minW={"65px"}
                      flexShrink={0}
                      isLoaded={!isLoading && !isFetching && !isEmpty(article)}
                    ></SkeletonCircle>
                  ) : (
                    <Avatar
                      bg={"gray.700"}
                      size={"lg"}
                      name={article?.author?.fullName}
                      src={article?.author?.avatar}
                    />
                  )}
                  <Skeleton
                    flex={1}
                    isLoaded={!isLoading && !isFetching && !isEmpty(article)}
                  >
                    <Stack minH={"30px"}>
                      <Text as={"strong"} fontSize={"large"}>
                        {article?.author?.fullName ||
                          maskHexAddress(
                            article?.author?.address || "0x4de54a23f34d3es29"
                          )}
                      </Text>{" "}
                      <Text
                        as={"time"}
                        fontWeight={"medium"}
                        fontSize={"sm"}
                        color={"gray.300"}
                      >
                        {article &&
                          format(
                            new Date(article?.createdAt as string),
                            "MMM dd, yyyy"
                          )}
                      </Text>
                    </Stack>
                  </Skeleton>
                </HStack>
                <Skeleton
                  isLoaded={!isLoading && !isFetching && !isEmpty(article)}
                >
                  {article?.intro && (
                    <Text color={"gray.300"} fontSize={"18px"} mb={1}>
                      {article?.intro}
                    </Text>
                  )}
                </Skeleton>
              </Box>
            </Stack>
          </Box>
          <Skeleton isLoaded={!isLoading && !isFetching && !isEmpty(article)}>
            <Box my={5}>
              <Image
                w={"full"}
                bg={"gray.900"}
                alt=""
                src={
                  article?.image ||
                  "/images/placeholder-image.png"
                }
                h={"auto"}
                // maxH={{ lg: 500, base: 400 }}
                // objectFit={'contain'}
              />
            </Box>
          </Skeleton>
          {isLoading || isFetching || isEmpty(article) ? (
            <Box minH={100} my={6} display={"flex"} flexDir={"column"} gap={3}>
              <SkeletonText h={10} />
              <SkeletonText h={10} />
              <SkeletonText h={10} />
              <SkeletonText h={10} />
            </Box>
          ) : (
            <Box maxW={"1000px"} mx={"auto"} my={5}>
              <MarkdownRenderer markdown={article?.content as string} />
            </Box>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export const DotDivider = () => {
  return (
    <Flex align={"center"} justify={"center"} px={2}>
      <Box w={1} h={1} rounded={"full"} bg={"gray.300"}></Box>
    </Flex>
  );
};

export default ArticleView;
