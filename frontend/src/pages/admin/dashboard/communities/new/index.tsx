import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import DashboardLayout from "src/components/AdminDashboardLayout";
import TextEditor from "src/components/TextEditor";

import { useState } from "react";
import CoverImageUploader from "src/components/CoverImageUploader";
import { useStorageUpload } from "@thirdweb-dev/react";
import { useFormik } from "formik";
import { resolveIPFSURI } from "src/helpers";
import { useInAppAuth } from "src/hooks/common";
import isEmpty from "just-is-empty";
import { useCreateCommunityMutation } from "src/state/services";
import { BsChevronLeft } from "react-icons/bs";
import { Link } from "@chakra-ui/next-js";

const NewCommunityPage = () => {
  const { mutateAsync: uploadToThirdweb } = useStorageUpload();
  const [coverFile, setCoverFile] = useState<File>();
  const [displayImageFile, setDisplayImageFile] = useState<File>();
  const { user, connect } = useInAppAuth();
  const [createCommunity, {}] = useCreateCommunityMutation();
  const toast = useToast({
    duration: 3000,
    position: "top",
    status: "success",
    title: "Community created successfully",
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      visibility: true,
    },
    onSubmit: async (values, actions) => {
      if (isEmpty(user)) {
        connect();
        return;
      }
      actions.setSubmitting(true);
      try {
        const dataToSave = {
          name: values.name,
          description: values.description,
          visibility: values.visibility ? "public" : "private",
          coverImage: "",
          displayImage: "",
          userId: user?.id,
        };
        if (coverFile) {
          const coverImageRes = await uploadToThirdweb({ data: [coverFile] });
          dataToSave.coverImage = resolveIPFSURI(coverImageRes[0]);
        }
        if (displayImageFile) {
          const displayImageRes = await uploadToThirdweb({
            data: [displayImageFile],
          });
          dataToSave.displayImage = resolveIPFSURI(displayImageRes[0]);
        }
        console.log({ values, dataToSave });
        await createCommunity(dataToSave);
        actions.setSubmitting(false);

        toast({
          title: "Community created successfully",
          status: "success",
        });
        setTimeout(() => {
          actions.resetForm();
          actions.setFieldValue("description", "");
          setCoverFile(undefined);
          setDisplayImageFile(undefined);
        }, 2000);
      } catch (err) {
        console.log(err);
        toast({
          title: "An error occurred, please try again",
          status: "error",
        });
        actions.setSubmitting(false);
      }
    },
  });
  function handleGetCoverFile(file: File | null) {
    setCoverFile(file as File);
  }
  function handleGetDisplayImageFile(file: File | null) {
    setDisplayImageFile(file as File);
  }
  return (
    <DashboardLayout>
      <Flex direction={"column"} w={"full"} pb={5} px={4}>
        <HStack mb={10}>
          <Button
            gap={2}
            bg={"gray.700"}
            variant={"solid"}
            // pos={"absolute"}
            top={3}
            left={3}
            colorScheme="gray"
            zIndex={5}
            as={Link}
            _hover={{ bg: "gray.800" }}
            href={"/admin/dashboard/communities"}
          >
            <BsChevronLeft /> <Text> Back</Text>
          </Button>
        </HStack>
        <Heading mb={2} size={"lg"}>
          Add new community
        </Heading>
        <Stack
          gap={5}
          mt={8}
          divider={<Divider />}
          as={"form"}
          /* @ts-ignore */
          onSubmit={formik.handleSubmit}
        >
          <FormControl isRequired>
            <FormLabel htmlFor="community-name">Community Name</FormLabel>
            <Input
              isRequired
              id="community-name"
              h={"auto"}
              fontWeight={500}
              _focus={{
                boxShadow: "0 0 0 1px transparent",
                borderColor: "gs-yellow.400",
              }}
              autoComplete="off"
              name="name"
              value={formik.values.name}
              py={3}
              placeholder="Community Name"
              fontSize={20}
              onChange={formik.handleChange}
              // size={"md"}
            />
          </FormControl>
          <Box>
            <FormLabel size={"md"} mt={2} mb={4} htmlFor="display-image">
              Display image (Avatar)
            </FormLabel>
            <CoverImageUploader
              subTitle="Recommended size: 500 x 500"
              radius="50%"
              useContainerSize={true}
              containerHeight={180}
              containerWidth={180}
              inputId="display-image"
              getCoverImageFile={handleGetDisplayImageFile}
            />
          </Box>
          <Box>
            <FormLabel size={"md"} mt={2} mb={4} htmlFor="cover-image">
              Cover image
            </FormLabel>
            <CoverImageUploader inputId="cover-image" getCoverImageFile={handleGetCoverFile} />
          </Box>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="community-visibility" mb="0">
              Community Visibility <Text as={"span"}>({formik.values.visibility ? "public" : "private"})</Text>
            </FormLabel>
            <Switch
              colorScheme="blue"
              name="visibility"
              onChange={formik.handleChange}
              id="community-visibility"
              isChecked={formik.values.visibility}
            />
          </FormControl>

          <Box>
            <FormLabel size={"md"} mt={2} mb={4}>
              About this community
            </FormLabel>
            <TextEditor
              onContentChange={(content) => formik.setFieldValue("description", content)}
              initialValue={formik.values.description}
            />
          </Box>
          <HStack gap={4} pos={"sticky"} bottom={0} pt={1} pb={3}>
            <Button type="submit" rounded={"full"} variant={"outline"} isLoading={formik.isSubmitting}>
              Save as draft
            </Button>
            <Button type="submit" rounded={"full"} colorScheme="gs-yellow" isLoading={formik.isSubmitting}>
              Publish
            </Button>
          </HStack>
        </Stack>
      </Flex>
    </DashboardLayout>
  );
};
export default NewCommunityPage;
