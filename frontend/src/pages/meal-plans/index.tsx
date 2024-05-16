"use client";

import Icon from "src/components/Icon";
import Footer from "src/components/Footer";
import { HeaderNav } from "src/components/HeaderNav";
import { shortenText } from "src/utils";
import { useGetMealPlansQuery } from "src/state/services";
import { MealPlan } from "src/types/shared";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";

const MealPlansPage = () => {
  const [btnIcon, setBtnIcon] = useState("bookmark_add");

  const { data, isFetching, isLoading } = useGetMealPlansQuery({});
  const mealPlans = data?.data as MealPlan[];
  const handleAddMealPlan = (plan: MealPlan) => {
    setBtnIcon("done");
    setTimeout(() => {
      setBtnIcon("bookmark_add");
    }, 2000);
  };
  return (
    <>
      <Head>
        <title>Rejuvenate | Meal Plans</title>
      </Head>
      <HeaderNav />
      <Box minH={400}>
        <Stack
          direction={"row"}
          px={{ lg: 6, base: 4 }}
          py={8}
          wrap={"wrap"}
          spacing={{ base: 4, lg: 6 }}
          mx={"auto"}
          maxW={1200}
          // bg={"gray.100"}
        >
          {!isLoading &&
            mealPlans?.length &&
            mealPlans?.map((plan) => (
              <Stack
                key={plan?.id}
                rounded={"lg"}
                boxShadow={"md"}
                bg={"gray.800"}
                minH={"250px"}
                p={2}
                maxW={350}
                gap={4}
                pb={5}
              >
                <Box
                  h={"170px"}
                  bg={"gray.200"}
                  roundedTop={"md"}
                  overflow={"hidden"}
                  pos={"relative"}
                >
                  <Box
                    pos={"absolute"}
                    roundedRight={"md"}
                    left={0}
                    bottom={0}
                    bg={"primaryColor.700"}
                    color={"white"}
                    px={3}
                    py={2}
                  >
                    <Text
                      as={"span"}
                      textTransform={"capitalize"}
                      fontSize={"small"}
                      fontWeight={"bold"}
                    >
                      {plan?.time}
                    </Text>
                  </Box>
                  <Image
                    alt=""
                    h={"full"}
                    w={"full"}
                    objectFit={"cover"}
                    src={plan?.image ?? "/images/meal-plan.jpg"}
                  />
                </Box>
                <Box>
                  <Heading size={"md"}>{plan?.title}</Heading>

                  <Text mt={3}>
                    {shortenText(
                      (plan?.intro as string)
                        ? (plan?.intro as string)
                        : plan?.content,
                      100
                    )}
                  </Text>
                </Box>
                <HStack spacing={"6"} flex={1}>
                  <Button
                    as={Link}
                    href={"/meal-plans/" + plan?.slug}
                    rounded={"full"}
                    size={"sm"}
                    variant="outline"
                    gap={"3"}
                  >
                    <Icon name="visibility" size={20} /> <span>View plan</span>
                  </Button>
                  <Button
                    rounded={"full"}
                    // onClick={() => handleAddMealPlan(plan)}
                    size={"sm"}
                    gap={3}
                  >
                    <Icon name={btnIcon} size={20} /> <span>Add to list</span>
                  </Button>
                </HStack>
              </Stack>
            ))}
        </Stack>
      </Box>
      <Footer />
    </>
  );
};

export default MealPlansPage;
