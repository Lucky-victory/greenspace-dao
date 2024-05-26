import { Box, HStack, IconButton } from "@chakra-ui/react";
import { Editor, useCurrentEditor } from "@tiptap/react";
import { useCallback, useState } from "react";
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
} from "react-icons/bs";
import { useDragAndDropImage } from "src/hooks/dropzone";

export const MenuBar = () => {
  const { editor } = useCurrentEditor();
  const { removeImage } = useDragAndDropImage([]);
  if (!editor) {
    return null;
  }
  const [linkValue, setLinkValue] = useState("");
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    setLinkValue(previousUrl);
    const url = linkValue;

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);
  const btnStyles = {
    size: "sm",
    fontSize: "medium",
    colorScheme: "gs-yellow",
  };
  function handleImageUpload(editor: Editor): void {
    throw new Error("Function not implemented.");
  }

  return (
    <HStack
      wrap={"wrap"}
      gap={2}
      borderBottom={"2px"}
      borderBottomColor={"gray.700"}
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
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={editor.isActive("heading", { level: 4 }) ? "solid" : "ghost"}
      >
        <BsTypeH4 size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={editor.isActive("heading", { level: 5 }) ? "solid" : "ghost"}
      >
        <BsTypeH5 size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
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
        variant={editor.isActive("img") ? "solid" : "ghost"}
        onClick={() => handleImageUpload(editor)}
      >
        <BsImage size={20} />
      </IconButton>
      <IconButton
        aria-label=""
        {...btnStyles}
        variant={editor.isActive("link") ? "solid" : "ghost"}
        onClick={() => setLink()}
      >
        <BsLink size={20} />
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
