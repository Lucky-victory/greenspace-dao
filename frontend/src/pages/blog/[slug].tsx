import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { format } from "date-fns";
import isEmpty from "just-is-empty";
import {
  Box,
  Container,
  VStack,
  Text,
  Avatar,
  Heading,
  Image,
  Flex,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  useColorModeValue,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Hide,
  Show
} from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

import MarkdownRenderer from "src/components/MarkdownRenderer";
import Footer from "src/components/Footer";
import { HeaderNav } from "src/components/HeaderNav";
import { maskHexAddress, resolveIPFSURI } from "src/helpers";
import { useGetArticleQuery } from "src/state/services";
import { replaceCloudflareIpfs } from "src/utils";

const ArticleView = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, isLoading, isFetching } = useGetArticleQuery({
    slug: slug as string
  });
  const article = data?.data;

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <>
      <Head>
        <title>{article?.title || "Article"}</title>
        <meta name="description" content={article?.intro} />
        <meta property="og:title" content={article?.title} />
        <meta property="og:description" content={article?.intro} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://greenspacedao.xyz/blog/${article?.slug}`} />
        <meta property="og:image" content={article?.image} />
      </Head>
      <HeaderNav />
      <Box py={12} bg={bgColor} minH="100vh">
        <Container maxW="4xl">
          <VStack spacing={8} align="stretch" pl={0}>
            <Hide below="md">
              <Breadcrumb pl={0} spacing="8px" separator={<LuChevronRight color="gray.500" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#">{article?.title || "Article"}</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Hide>
            <Show below="md">
              <Breadcrumb pl={0} spacing="8px" separator={<LuChevronRight color="gray.500" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#">Article</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Show>

            <Skeleton isLoaded={!isLoading && !isFetching && !isEmpty(article)}>
              <VStack spacing={4} align="start">
                <Tag size="md" colorScheme="green">
                  Blog
                </Tag>
                <Heading as="h1" size="2xl" color={textColor}>
                  {article?.title}
                </Heading>
                <Flex align="center" wrap="wrap" gap={4}>
                  <Avatar size="md" name={article?.author?.fullName} src={article?.author?.avatar} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={textColor}>
                      {article?.author?.fullName || maskHexAddress(article?.author?.address || "0x4de54a23f34d3es29")}
                    </Text>
                    <Text fontSize="sm" color={secondaryTextColor}>
                      {article && format(new Date(article?.createdAt as string), "MMMM dd, yyyy")}
                    </Text>
                  </VStack>
                </Flex>
              </VStack>
            </Skeleton>

            <Skeleton isLoaded={!isLoading && !isFetching && !isEmpty(article)}>
              <Image
                w="full"
                h="400px"
                objectFit="cover"
                src={replaceCloudflareIpfs(article?.image!) || "/images/placeholder-image.png"}
                alt={article?.title || "Article image"}
                borderRadius="lg"
              />
            </Skeleton>

            <Skeleton isLoaded={!isLoading && !isFetching && !isEmpty(article)}>
              {article?.intro && (
                <Text fontSize="xl" fontWeight="medium" color={secondaryTextColor}>
                  {article?.intro}
                </Text>
              )}
            </Skeleton>

            <Box bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
              {isLoading || isFetching || isEmpty(article) ? (
                <VStack spacing={4} align="stretch">
                  <SkeletonText noOfLines={4} spacing={4} />
                  <SkeletonText noOfLines={4} spacing={4} />
                  <SkeletonText noOfLines={4} spacing={4} />
                </VStack>
              ) : (
                <MarkdownRenderer markdown={article?.content as string} />
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ArticleView;
