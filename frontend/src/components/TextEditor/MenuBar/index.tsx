import {
  Box,
  HStack,
  IconButton,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Input,
  Text,
  Portal,
} from "@chakra-ui/react";
import { useStorageUpload } from "@thirdweb-dev/react";
import { Editor, useCurrentEditor } from "@tiptap/react";
import { useFormik } from "formik";
import isEmpty from "just-is-empty";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  BsBlockquoteLeft,
  BsArrow90DegLeft,
  BsArrow90DegRight,
  BsCodeSlash,
  BsHighlighter,
  BsImage,
  BsJustify,
  BsLink,
  BsParagraph,
  BsTextCenter,
  BsTextLeft,
  BsTextRight,
  BsTypeBold,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeH4,
  BsTypeH5,
  BsTypeH6,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsArrow90DegDown,
  BsArrow90DegUp,
  BsListOl,
  BsListUl,
} from "react-icons/bs";
import { resolveIPFSURI } from "src/helpers";
import { useDragAndDropImage } from "src/hooks/dropzone";

export const MenuBar = () => {
  const { editor } = useCurrentEditor();
  const { mutateAsync: uploadToThirdweb } = useStorageUpload();

  const initialFocusRef = useRef<any>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const btnStyles = {
    size: "sm",
    fontSize: "medium",
    colorScheme: "gs-yellow",
  };
  const formik = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: (values, actions) => {
      const content = values.content;
      const previousUrl = editor?.getAttributes("link").href;
      actions.setFieldValue("content", previousUrl);
      const url = content;

      if (url === null) {
        return;
      }

      // empty
      if (isEmpty(url)) {
        editor?.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
      }

      // update link
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      onClose();
    },
  });
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const { files, resetImages, open: openFileUpload } = useDragAndDropImage();
  if (!editor) {
    return null;
  }
  const openLinkModal = useCallback(() => {
    onOpen();
  }, []);

  function handleUploadOpen() {
    openFileUpload();
  }
  useEffect(() => {
    async function handleImageUpload() {
      if (isEmpty(files)) return;
      try {
        setIsUploadingImage(true);

        const res = await uploadToThirdweb({ data: [files[0]] });
        editor
          ?.chain()
          .focus()
          .setImage({ src: resolveIPFSURI(res[0]) })
          .run();
        resetImages();
        setIsUploadingImage(false);
      } catch (error) {}
    }
    handleImageUpload();
  }, [files]);
  return (
    <HStack
      wrap={"wrap"}
      gap={2}
      border={"1px"}
      py={2}
      px={1}
      rounded={"md"}
      borderColor={"gray.700"}
      pos={"sticky"}
      top={0}
      bg={"gray.900"}
      zIndex={2}
    >
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        variant={editor.isActive("heading", { level: 1 }) ? "solid" : "ghost"}
      >
        <BsTypeH1 size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={editor.isActive("heading", { level: 2 }) ? "solid" : "ghost"}
      >
        <BsTypeH2 size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={editor.isActive("heading", { level: 3 }) ? "solid" : "ghost"}
      >
        <BsTypeH3 size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        variant={editor.isActive("heading", { level: 4 }) ? "solid" : "ghost"}
      >
        <BsTypeH4 size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        variant={editor.isActive("heading", { level: 5 }) ? "solid" : "ghost"}
      >
        <BsTypeH5 size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        variant={editor.isActive("heading", { level: 6 }) ? "solid" : "ghost"}
      >
        <BsTypeH6 size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().setParagraph().run()}
        variant={editor.isActive("paragraph") ? "solid" : "ghost"}
      >
        <BsParagraph size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "solid" : "ghost"}
      >
        <BsTypeBold size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "solid" : "ghost"}
      >
        <BsTypeItalic size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "solid" : "ghost"}
      >
        <BsTypeStrikethrough size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        variant={editor.isActive("highlight") ? "solid" : "ghost"}
      >
        <BsHighlighter size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        variant={editor.isActive({ textAlign: "left" }) ? "solid" : "ghost"}
      >
        <BsTextLeft size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        variant={editor.isActive({ textAlign: "center" }) ? "solid" : "ghost"}
      >
        <BsTextCenter size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        variant={editor.isActive({ textAlign: "right" }) ? "solid" : "ghost"}
      >
        <BsTextRight size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        variant={editor.isActive({ textAlign: "justify" }) ? "solid" : "ghost"}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <BsJustify size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        variant={editor.isActive("bulletList") ? "solid" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <BsListUl size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        variant={editor.isActive("orderedList") ? "solid" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <BsListOl size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        variant={editor.isActive("blockquote") ? "solid" : "ghost"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <BsBlockquoteLeft size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        isLoading={isUploadingImage}
        variant={editor.isActive("img") ? "solid" : "ghost"}
        onClick={() => handleUploadOpen()}
      >
        <BsImage size={20} />
      </IconButton>
      <Popover
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        initialFocusRef={initialFocusRef}
      >
        <PopoverTrigger>
          <IconButton
            aria-label=""
            {...btnStyles}
            variant={editor.isActive("link") ? "solid" : "ghost"}
          >
            <BsLink size={20} />
          </IconButton>
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            zIndex={100000}
            bg={"gray.800"}
            borderColor="gray.800"
            py={4}
          >
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight="bold" border="0">
              Enter URL:
            </PopoverHeader>
            <PopoverBody>
              <HStack
                as={"form"}
                /* @ts-ignore */
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit(
                    e as unknown as FormEvent<HTMLFormElement>
                  );
                }}
              >
                <Input
                  name="content"
                  _focus={{
                    boxShadow: "0 0 0 1px transparent",
                    borderColor: "gs-yellow.400",
                  }}
                  rounded={"md"}
                  autoComplete="off"
                  value={formik.values.content}
                  ref={initialFocusRef}
                  onChange={formik.handleChange}
                  placeholder="https://example.com"
                  size={"sm"}
                />
                <IconButton aria-label="" variant={"ghost"} type="submit">
                  <BsArrow90DegDown />
                </IconButton>
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>

      <IconButton
        aria-label=""
        {...btnStyles}
        isDisabled={!editor.can().undo()}
        variant={"ghost"}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <BsArrow90DegLeft size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        isDisabled={!editor.can().redo()}
        variant={"ghost"}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <BsArrow90DegRight size={20} />
      </IconButton>
    </HStack>
  );
};
