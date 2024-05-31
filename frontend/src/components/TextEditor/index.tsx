import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Box } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useHTMLToMarkdownConverter } from "src/hooks/common";
type TextEditorHandle = {
  resetContent: () => void;
};

const TextEditor = forwardRef<
  TextEditorHandle,
  {
    onContentChange: (content: string) => void;
    initialValue: string;
    returnMarkdown?: boolean;
  }
>(({ onContentChange, initialValue, returnMarkdown = true }, ref) => {
  const [editorContent, setEditorContent] = useState<string>(initialValue || "");
  const { editor } = useCurrentEditor();
  const { markdown, updateHtml } = useHTMLToMarkdownConverter();
  const extensions = [
    StarterKit,
    Link.configure({
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer",
      },
      openOnClick: false,
      autolink: true,
    }),
    Typography,
    Image,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight,
  ];

  useImperativeHandle(
    ref,
    () => ({
      resetContent: () => {
        setEditorContent(initialValue);
        editor?.commands?.clearContent();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValue]
  );

  const getEditorContent = useCallback(
    (content: string) => {
      onContentChange(content);
    },
    [onContentChange]
  );

  function handleEditorUpdate(editor: Editor) {
    setEditorContent(editor.getHTML());
    if (returnMarkdown) {
      updateHtml(editor.getHTML());
      getEditorContent(markdown);
    } else {
      getEditorContent(editor.getHTML());
    }
  }

  return (
    <Box py={3}>
      <EditorProvider
        enablePasteRules={true}
        onUpdate={({ editor }) => {
          // @ts-ignore
          handleEditorUpdate(editor);
        }}
        onTransaction={({ editor }) => {
          // @ts-ignore
          handleEditorUpdate(editor);
        }}
        slotBefore={<MenuBar />}
        content={editorContent}
        extensions={extensions}
      />
    </Box>
  );
});

TextEditor.displayName = "TextEditor";
export default TextEditor;
