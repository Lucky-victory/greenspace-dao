import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import isEmpty from "just-is-empty";
import Head from "next/head";
import React, { KeyboardEvent, useState } from "react";
import { useCheckNutritionistStatusMutation } from "src/state/services";

const NutritionistStatusPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkStatus, { data: response, isLoading }] =
    useCheckNutritionistStatusMutation();
  const status = response?.data?.status!;
  console.log(status);
  const [value, setValue] = useState("");
  const formik = useFormik({
    initialValues: {
      address: "",
    },
    validateOnMount: true,
    onSubmit: async (values, formikHelpers) => {
      try {
        formik.setSubmitting(true);
        await checkStatus({
          address: values.address,
        }).unwrap();

        setTimeout(() => {
          formikHelpers.setSubmitting(false);
          formik.resetForm();
        }, 2000);
      } catch (error) {}
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.address) {
        errors.address = "Address is required";
      }
      return errors;
    },
  });

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
          {!isEmpty(status) && (
            <Text textAlign={"center"}>
              Your application is{" "}
              <Text
                as={"b"}
                color={status === "verified" ? "gs-green.500" : "gray.400"}
              >
                {status}
              </Text>
            </Text>
          )}
          <Stack
            spacing={6}
            as={"form"}
            // @ts-ignore
            onSubmit={formik.handleSubmit}
          >
            <FormControl isRequired>
              <Input
                rounded={"12px"}
                _focus={{
                  boxShadow: "0 0 0 1px transparent",
                  borderColor: "gs-yellow.400",
                }}
                autoComplete="off"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                placeholder="0x000...d0ecd"
              />
            </FormControl>

            <Button
              isDisabled={formik.values.address === ""}
              isLoading={formik.isSubmitting || isLoading}
              size={"lg"}
              rounded={"full"}
              type="submit"
              loadingText={"Checking status..."}
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
