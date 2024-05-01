import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { KeyboardEvent, useState } from "react";

const NutritionistStatusPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState("");
  const handleInputKeyup = (evt: KeyboardEvent) => {
    if (evt.key === "Enter") {
      handleSubmit();
    }
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
  };
  return (
    <>
      <Head>
        <title>Nutritionist | Check Application Status</title>
      </Head>
      <Flex className="h-screen" align={"center"}>
        <Stack
          shadow={"md"}
          rounded={"md"}
          spacing={6}
          bg={"black"}
          mx={"auto"}
          py={{ lg: 8, base: 6 }}
          px={{ base: 3, lg: 6 }}
        >
          <Stack>
            <Heading textAlign={"center"} size={"lg"}>
              Application status
            </Heading>
            <Text color={"gray.400"} fontSize={"14px"} textAlign={"center"}>
              Enter your address to check your application status
            </Text>
          </Stack>
          <Stack spacing={6}>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyUp={handleInputKeyup}
              placeholder="Enter wallet address"
            />
            <Button
              isDisabled={!value || isSubmitting}
              isLoading={isSubmitting}
              onClick={() => handleSubmit()}
            >
              Continue
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
};

export default NutritionistStatusPage;
