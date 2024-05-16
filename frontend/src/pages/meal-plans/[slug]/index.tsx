import MarkdownRenderer from "src/components/MarkdownRenderer";
import { HeaderNav } from "src/components/HeaderNav";
import { maskWalletAddress } from "src/utils";
import { useGetArticleQuery, useGetMealPlanQuery } from "src/state/services";
import { Article } from "src/types/shared";
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
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import isEmpty from "just-is-empty";
import Head from "next/head";
import { usePathname, useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

const MealPlanView = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, isLoading, isFetching } = useGetMealPlanQuery({
    slug: slug as string,
  });
  const mealPlan = data?.data;

  return (
    <>
      <Head>
        <title>{mealPlan?.title}</title>
        <meta name="description" content={mealPlan?.intro} />
        <meta property="og:title" content={mealPlan?.title} />

        <meta property="og:description" content={mealPlan?.intro} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://rejuvenate-ai/blog/${mealPlan?.slug}`}
        />
        <meta property="og:image" content={mealPlan?.image} />
      </Head>
      <HeaderNav />
      <Box py={8}>
        <Box
          bg={"gray.800"}
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
                  isLoaded={!isLoading && !isFetching && !isEmpty(mealPlan)}
                >
                  <Heading mb={5} as={"h1"}>
                    {mealPlan?.title}
                  </Heading>
                </Skeleton>
                <HStack
                  borderY={"1px"}
                  borderColor={"gray.300"}
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
                      isLoaded={!isLoading && !isFetching && !isEmpty(mealPlan)}
                    ></SkeletonCircle>
                  ) : (
                    <Avatar
                      size={"lg"}
                      name={mealPlan?.author?.address}
                      src={mealPlan?.author?.avatar}
                    />
                  )}
                  <Skeleton
                    flex={1}
                    isLoaded={!isLoading && !isFetching && !isEmpty(mealPlan)}
                  >
                    <Stack minH={"30px"}>
                      <Text as={"strong"} fontSize={"large"}>
                        {mealPlan?.author?.fullName ||
                          maskWalletAddress(
                            mealPlan?.author?.address || "0x4de54a23f34d3es29"
                          )}
                      </Text>{" "}
                      <Text
                        as={"time"}
                        fontWeight={"medium"}
                        fontSize={"sm"}
                        color={"gray.600"}
                      >
                        {mealPlan &&
                          format(
                            new Date(mealPlan?.createdAt as string),
                            "MMM dd, yyyy"
                          )}
                      </Text>
                    </Stack>
                  </Skeleton>
                </HStack>
                <Skeleton
                  isLoaded={!isLoading && !isFetching && !isEmpty(mealPlan)}
                >
                  {mealPlan?.intro && (
                    <Text color={"gray.600"} fontSize={"18px"} mb={1}>
                      {mealPlan?.intro}
                    </Text>
                  )}
                </Skeleton>
              </Box>
            </Stack>
          </Box>
          <Skeleton isLoaded={!isLoading && !isFetching && !isEmpty(mealPlan)}>
            <Box>
              <Image
                w={"full"}
                bg={"gray.100"}
                alt=""
                src={mealPlan?.image || "/images/placeholder-image.png"}
                h={"auto"}
                // maxH={{ lg: 500, base: 400 }}
                // objectFit={'contain'}
              />
            </Box>
          </Skeleton>
          {isLoading || isFetching || isEmpty(mealPlan) ? (
            <Box minH={100} my={6} display={"flex"} flexDir={"column"} gap={3}>
              <SkeletonText h={10} />
              <SkeletonText h={10} />
              <SkeletonText h={10} />
              <SkeletonText h={10} />
            </Box>
          ) : (
            <Box maxW={"1000px"} mx={"auto"} my={5}>
              <MarkdownRenderer markdown={mealPlan?.content as string} />
            </Box>
          )}
        </Box>
      </Box>
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

export default MealPlanView;
