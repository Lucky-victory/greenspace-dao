import { Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useFormik } from "formik";

type GetNotifiedFormProps = {
  title: string;
  description: string;
  buttonText?: string;
  notifyFor: "event" | "challenge";
};
export default function GetNotifiedForm({
  title,
  description,
  buttonText,
  notifyFor,
}: GetNotifiedFormProps) {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnMount: true,
    onSubmit: (values, formikHelpers) => {
      console.log(values);

      setTimeout(() => {
        formikHelpers.setSubmitting(false);
      }, 2000);
    },
  });
  return (
    <Stack
      minW={{ base: 300, md: 350, lg: 400 }}
      flex={{ base: 1, lg: 0 }}
      flexShrink={0}
      bg={"black"}
      rounded={"15px"}
      border={"1px solid var(--chakra-colors-gray-600)"}
      p={{ base: 5, lg: 8 }}
    >
      <Heading size={"lg"} fontWeight={600} mb={2}>
        {title}
      </Heading>
      <Text fontSize={"15px"} color={"gray.300"}>
        {description}
      </Text>
      {/* @ts-ignore */}
      <Stack mt={4} as={"form"} onSubmit={formik.handleSubmit} id="notify-form">
        <Input
          _focus={{
            boxShadow: "0 0 0 1px transparent",
            borderColor: "gs-yellow.400",
          }}
          border={"2px"}
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          type="email"
          name="email"
          placeholder="me@example.com"
          rounded={"full"}
          isRequired
          size={"lg"}
        />
      </Stack>
      <Button
        form="notify-form"
        type="submit"
        mt={2}
        colorScheme="gs-gray"
        disabled={formik.isSubmitting || !formik.isValid}
        isLoading={formik.isSubmitting}
        size={"lg"}
        rounded={"full"}
      >
        {buttonText || "Get notified"}
      </Button>
    </Stack>
  );
}
