import { Box, Button, Flex, FormLabel, HStack, Input, Select, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import NutritionistDashboardLayout from "src/components/NutritionistDashboardLayout";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";
import MarkdownRenderer from "src/components/MarkdownRenderer";
import DragAndDropImage from "src/components/DragAndDropImage";

import { generateSlug } from "src/utils";

import { useRouter } from "next/router";
import { NewMealPlan, PostStatus } from "src/types/shared";
import { useAddMealPlanMutation } from "src/state/services";
import { useAppContext } from "src/context/state";
import { useInAppAuth } from "src/hooks/common";
import { resolveIPFSURI, uploadToThirdWeb } from "src/helpers";
import { useStorageUpload } from "@thirdweb-dev/react";
import TextEditor from "src/components/TextEditor";

export default function NewPostPage() {
  const [addMealPlan, { isLoading, status, isSuccess, isError, data }] = useAddMealPlanMutation();

  const router = useRouter();
  const toast = useToast({
    duration: 3000,
    position: "top",
    status: "success",
    title: " Successful",
  });
  const { user } = useInAppAuth();
  const [imageFile, setImageFile] = useState<string>();
  const { mutateAsync: uploadToThirdWeb } = useStorageUpload();

  const [coverImageFile, setCoverImageFile] = useState<File>();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [contentValue, setContentValue] = useState("");
  const [post, setPost] = useState<NewMealPlan>({
    title: "",
    slug: "",
    content: "",
    intro: "",
    image: "",
    time: "breakfast",
    status: "draft",
    userId: user?.id!,
  });

  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const onImageChangeHandler = useCallback((hasImage: boolean, files: File[], image: string) => {
    if (hasImage) {
      setImageFile(image);
    }
  }, []);
  async function saveAsDraft() {
    try {
      let imageUrl = "";
      if (coverImageFile) {
        imageUrl = (await handleFileUpload())!;
      }
      const postToSave = {
        ...post,
        slug: generateSlug(post.title),
        image: imageUrl,
      };

      await addMealPlan(postToSave).unwrap();
    } catch (error) {
      toast({ title: "An error occurred, please try again", status: "error" });
    }
  }
  const handleFileUpload = async () => {
    try {
      const [fileUri] = await uploadToThirdWeb({ data: [coverImageFile] });

      return resolveIPFSURI(fileUri);
    } catch (error) {}
  };
  async function saveAsPublished() {
    try {
      let imageUrl = "";
      if (coverImageFile) {
        imageUrl = (await handleFileUpload())!;
      }
      const postToSave = {
        ...post,
        status: "published" as PostStatus,
        slug: generateSlug(post.title),
        image: imageFile,
      };

      await addMealPlan(postToSave).unwrap();
    } catch (error) {
      toast({ title: "An error occurred, please try again", status: "error" });
    }
  }
  function handleEditorChange(value: string): void {
    setContentValue(value);
    setPost((prev) => ({ ...prev, content: value }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
    const { name, value } = event.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  }
  function resetFields(): void {
    setPost({
      title: "",
      slug: "",
      content: "",
      intro: "",
      image: "",
      time: "breakfast",
      status: "draft",
      userId: user?.id!,
    });
    setContentValue("");
    setImageFile(undefined);
  }

  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout;
    if (isSuccess) {
      resetFields();
      toast({ title: data?.message });
      setTimeout(() => {
        router.replace("/nutritionist/dashboard/meal-plans");
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.message, isSuccess]);

  useEffect(() => {
    setPost((prev) => ({
      ...prev,
      content: contentValue,
      userId: user?.id!,
    }));
  }, [contentValue, user?.id]);
  return (
    <>
      <NutritionistDashboardLayout>
        <Box px={4} my={5}>
          <Box bg={"gray.800"} rounded={"14px"}>
            <Flex
              pos={"sticky"}
              top={0}
              zIndex={10}
              bg={"gray.800"}
              justifyContent={"flex-end"}
              py={3}
              my={4}
              px={4}
              borderBottom={"1px"}
              borderColor={"blackTrans-15"}
            >
              {" "}
              <HStack gap={4}>
                <Button isLoading={isLoading} onClick={saveAsPublished} rounded={"full"} px={6} size="md">
                  Publish{" "}
                </Button>{" "}
                <Button isLoading={isLoading} onClick={saveAsDraft} rounded={"full"} variant={"outline"}>
                  Save as draft
                </Button>
              </HStack>
            </Flex>
            <Stack px={4} py={6} gap={3}>
              <DragAndDropImage
                onUploadChange={(hasImage, files, image) => onImageChangeHandler(hasImage, files, image)}
              />{" "}
              <Input
                name="title"
                value={post.title}
                onChange={handleInputChange}
                h={"auto"}
                py={2}
                placeholder="Meal Plan Title..."
                fontSize={"large"}
                fontWeight={"medium"}
              />
              <Textarea
                name="intro"
                value={post.intro}
                onChange={handleInputChange}
                my={4}
                maxH={"200px"}
                placeholder="A short introduction for the Meal plan..."
              ></Textarea>
              <Box my={4}>
                <FormLabel htmlFor="meal-time">Choose Meal Time</FormLabel>
                <Select id="meal-time" defaultValue={""} name="time" onChange={handleInputChange}>
                  <option value="" disabled></option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </Select>
                {/* <Text my={2} color='red.600'>
                  {errors.time?.message}
                </Text> */}
              </Box>
              <TextEditor initialValue={contentValue} onContentChange={(value: string) => handleEditorChange(value)} />
              <Box></Box>
            </Stack>
          </Box>
        </Box>
      </NutritionistDashboardLayout>
    </>
  );
}
