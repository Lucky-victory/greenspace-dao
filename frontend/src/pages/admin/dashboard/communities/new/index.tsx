import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  ResponsiveValue,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import DashboardEmptyArea from "src/components/DashboardEmptyArea";
import DashboardLayout from "src/components/AdminDashboardLayout";
import TextEditor from "src/components/TextEditor";
import { useDragAndDropImage } from "src/hooks/dropzone";
import isEmpty from "just-is-empty";
import { BsPencil, BsPencilSquare, BsTrash } from "react-icons/bs";
const NewCommunityPage = () => {
  const { images, files, getInputProps, getRootProps } = useDragAndDropImage();
  console.log({ images, files });

  return (
    <DashboardLayout>
      <Flex direction={"column"} w={"full"} py={5} px={4}>
        <Heading mb={2}>Add new community</Heading>
        <Stack gap={5} mt={8}>
          <Input
            h={"auto"}
            fontWeight={500}
            py={3}
            placeholder="Community Name"
            fontSize={30}
            size={"md"}
          />
          <Box>
            <Text>Cover image</Text>
            {isEmpty(images) && (
              <Box
                {...getRootProps({
                  className: "dropzone",
                  h: "10rem",
                  textAlign: "center" as ResponsiveValue<"center">,
                  maxW: "600px",
                  border: "2px",
                  borderStyle: "dashed",
                  borderColor: "gray.400",
                  borderRadius: "0.5rem",
                  p: "1rem",
                  mx: "auto",
                  cursor: "pointer",
                })}
              >
                <input {...getInputProps()} />
                <Stack
                  justify={"center"}
                  borderRadius={"inherit"}
                  h={"100%"}
                  w={"100%"}
                >
                  <Stack>
                    <Text as={"span"} fontSize={"18px"} fontWeight={"medium"}>
                      Drag or Upload Cover Image
                    </Text>
                    <Text as={"span"} color={"gray.500"}>
                      Recommended size: 1260 x 630
                    </Text>
                  </Stack>
                </Stack>
              </Box>
            )}
            <Box pos={"relative"}>
              <HStack pos={"absolute"} zIndex={1} right={0} top={0}>
                <Button size={"sm"} gap={2}>
                  <BsPencilSquare /> <Text as={"span"}>Replace</Text>
                </Button>
                <Button size={"sm"} colorScheme="red" gap={2}>
                  <BsTrash /> <Text as={"span"}>Delete</Text>
                </Button>
              </HStack>
              {!isEmpty(images) && <Image src={images[0].src as string} />}
            </Box>
          </Box>
          <FormControl>
            <HStack>
              <FormLabel>
                <Text>Make public</Text>
              </FormLabel>
              <Checkbox isChecked />
            </HStack>
          </FormControl>
          <Textarea placeholder="Community details"></Textarea>

          <TextEditor />
          <HStack gap={4}>
            <Button rounded={"full"} variant={"outline"}>
              Save as draft
            </Button>
            <Button rounded={"full"} colorScheme="gs-yellow">
              Publish
            </Button>
          </HStack>
        </Stack>
      </Flex>
    </DashboardLayout>
  );
};
export default NewCommunityPage;
