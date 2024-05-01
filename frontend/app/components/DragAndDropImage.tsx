/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  Flex,
  Image,
  LinkBox,
  ResponsiveValue,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FiDelete, FiTrash } from "react-icons/fi";

import { generateUrlSafeId } from "@/utils";
function DragAndDropImage({
  initialImages = [],
  onUploadChange = (hasImage: boolean, files: File[], image: string) => {},
}: {
  initialImages?: Array<{
    id: string;
    index?: number;
    src: string | ArrayBuffer | null;
  }>;
  onUploadChange: (hasImage: boolean, files: File[], image: string) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const [images, setImages] = useState<
    Array<{ id: string; index?: number; src: string | ArrayBuffer | null }>
  >(initialImages || []);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    acceptedFiles.map((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: generateUrlSafeId(), index, src: e.target && e.target.result },
        ]);
      };
      reader.readAsDataURL(file);

      return file;
    });
  }, []);
  const onUpload = useCallback(
    (hasImage: boolean, files: File[], image: string) => {
      onUploadChange(hasImage, files, image);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, files]
  );

  useEffect(() => {
    onUpload(images.length > 0, files, images?.[0]?.src as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, files]);
  const { getRootProps, getInputProps } = useDropzone({
    onError(err) {
      console.log(err);
    },
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
    onDrop,
    maxFiles: 1,
  });
  function removeImage(image: {
    id: string;
    index?: number;
    src: string | ArrayBuffer | null;
  }) {
    let _images = [...images];
    let _files = [...files];
    _files = _files.filter((f, i) => i !== image.index);
    _images = _images.filter((img) => img.id !== image.id);
    setImages(_images);
    setFiles(_files);
  }

  return (
    <Box>
      {/* @ts-ignore */}
      {!images?.length > 0 && (
        <Box
          {...getRootProps({
            className: "dropzone",
            h: "10rem",
            textAlign: "center" as ResponsiveValue<"center">,
            maxW: "600px",
            border: "2px",
            borderStyle: "dashed",
            borderColor: "gray.400",
            borderRadius: "0.5rem ",
            p: "1rem",
            mx: "auto",
            cursor: "pointer",
          })}
        >
          <input {...getInputProps()} />
          <Stack
            _hover={{ bg: "appBlack.50" }}
            {...{
              justify: "center",
            }}
            borderRadius={"inherit"}
            h={"100%"}
            w={"100%"}
          >
            <Stack>
              <Text as={"span"} fontSize={"18px"} fontWeight={"medium"}>
                Drag or Upload Cover Image
              </Text>
              <Text as={"span"} color={"gray.500"}>
                Recommended size: 1600 x 840
              </Text>
            </Stack>
          </Stack>
        </Box>
      )}
      <Box mb={8}>
        <Flex gap={"0.75rem"} pt={"1rem"}>
          {images.map((image, i) => (
            <Box
              pos={"relative"}
              maxH={"700px"}
              w={"full"}
              key={"cover-image" + i}
            >
              <Button
                onClick={() => removeImage(image)}
                pos={"absolute"}
                top={"0"}
                right={"0"}
                _hover={{ bg: "appBlack.100" }}
                border={"1px"}
                borderColor={"currentColor"}
                color={"red.600"}
                bg={"white"}
                p={2}
                gap={2}
                rounded={"full"}
                zIndex={2}
              >
                <FiTrash /> Remove
              </Button>
              <Image
                w={"100%"}
                h={"100%"}
                alt="preview"
                objectFit={"cover"}
                src={image.src as string}
              />
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

export default DragAndDropImage;
