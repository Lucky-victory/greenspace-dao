import { useEffect, useState, useCallback } from "react";
import {
  useDropzone,
  DropzoneOptions,
  DropzoneRootProps,
  DropzoneInputProps,
} from "react-dropzone";
import { generateUrlSafeId } from "src/utils";

export interface DropzoneImage {
  id: string;
  index?: number;
  src: string | ArrayBuffer | null | undefined;
}

export type OnUploadChange = (
  hasImage: boolean,
  files: File[],
  image: string
) => void;

interface UseDragAndDropImageReturn {
  files: File[];
  images: DropzoneImage[];
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  removeImage: (image: DropzoneImage) => void;
}

export function useDragAndDropImage(
  initialImages: DropzoneImage[] = [],
  onUploadChange: OnUploadChange = () => {},
  maxFiles = 1
): UseDragAndDropImageReturn {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<DropzoneImage[]>(initialImages);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    acceptedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: generateUrlSafeId(), index, src: e.target?.result },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const onUpload = useCallback(
    (hasImage: boolean, files: File[], image: string) => {
      onUploadChange(hasImage, files, image);
    },
    [onUploadChange]
  );

  useEffect(() => {
    onUpload(images.length > 0, files, images[0]?.src as string);
  }, [images, files, onUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
    onDrop,
    maxFiles: maxFiles,
  });

  const removeImage = (image: DropzoneImage) => {
    const filteredFiles = files.filter((_, i) => i !== image.index);
    const filteredImages = images.filter((img) => img.id !== image.id);
    setFiles(filteredFiles);
    setImages(filteredImages);
  };

  return {
    files,
    images,
    getRootProps,
    getInputProps,
    removeImage,
  };
}
