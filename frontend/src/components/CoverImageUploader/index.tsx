import { Box, Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { ResponsiveValue } from "@chakra-ui/system";
import isEmpty from "just-is-empty";
import { useCallback, useEffect, useState } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { DropzoneImage, useDragAndDropImage } from "src/hooks/dropzone";

interface Props {
  subTitle?: string;
  getCoverImageFile?: (file: File | null) => void;
  inputId?: string;
  /**
   * whether to display the image with the same width and height as the container
   */
  useContainerSize?: boolean;
  containerWidth?: number | string;
  containerHeight?: number | string;
  radius?: string;
}
export function CoverImageUploader({
  subTitle = "Recommended size: 1260 x 630",
  inputId,
  radius = "0.5rem",
  getCoverImageFile,
  useContainerSize = false,
  containerWidth = "600px",
  containerHeight = "10rem",
}: Props) {
  const {
    images,
    files,
    getInputProps,
    getRootProps,
    removeImage,

    open: openCoverImageDialog,

    resetImages,
  } = useDragAndDropImage([]);

  const [coverImage, setCoverImage] = useState<DropzoneImage>();
  const [coverImageFile, setCoverImageFile] = useState<File>();
  function handleInputTrigger() {
    openCoverImageDialog();
  }
  const getFile = useCallback(
    (file: File) => {
      getCoverImageFile?.(file);
    },
    [getCoverImageFile]
  );

  useEffect(() => {
    if (images.length > 0) {
      images.splice(0, images.length - 1);
      setCoverImage(images[0]);
    }
    // keep only the last file
    if (files.length > 0) {
      files.splice(0, files.length - 1);
      setCoverImageFile(files[0]);
    }
    getFile(files[0]);
  }, [images, files]);
  function handleRemoveCoverImage() {
    resetImages();
  }

  return (
    <Box>
      {isEmpty(images) && (
        <Box
          {...getRootProps({
            className: "dropzone",
            h: containerHeight,
            textAlign: "center" as ResponsiveValue<"center">,
            maxW: containerWidth,
            border: "2px",
            borderStyle: "dashed",
            borderColor: "gray.400",
            borderRadius: radius,
            p: "1rem",
            mx: "auto",
            cursor: "pointer",
          })}
        >
          <input {...getInputProps()} id={inputId} />
          <Stack
            justify={"center"}
            borderRadius={"inherit"}
            h={"100%"}
            w={"100%"}
          >
            <Stack>
              <Text as={"span"} fontSize={"18px"} fontWeight={"medium"}>
                Drag or Upload Image
              </Text>
              <Text as={"span"} color={"gray.500"}>
                {subTitle}
              </Text>
            </Stack>
          </Stack>
        </Box>
      )}
      {!isEmpty(images) && (
        <Stack align={"flex-start"}>
          <Box pos={"relative"}>
            <HStack
              pt={1}
              pr={1}
              pos={"absolute"}
              gap={3}
              zIndex={1}
              right={0}
              top={0}
            >
              <Button size={"sm"} gap={2} onClick={handleInputTrigger}>
                <BsPencilSquare />
              </Button>
              <Button
                size={"sm"}
                colorScheme="red"
                gap={2}
                onClick={() => handleRemoveCoverImage()}
              >
                <BsTrash />
              </Button>
            </HStack>
            {useContainerSize && (
              <Image
                src={coverImage?.src as string}
                width={containerWidth}
                h={containerHeight}
                objectFit={"cover"}
              />
            )}
            {!useContainerSize && <Image src={coverImage?.src as string} />}
          </Box>
        </Stack>
      )}
    </Box>
  );
}
