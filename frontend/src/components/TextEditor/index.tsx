import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Box } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useHTMLToMarkdownConverter } from "src/hooks/common";
export default function TextEditor({
  onEditorContent,
  returnMarkdown = true,
}: {
  onEditorContent: (content: string) => void;
  returnMarkdown?: boolean;
}) {
  const [editorContent, setEditorContent] = useState<string>(`
    
    `);
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
  const getEditorContent = useCallback(
    (content: string) => {
      onEditorContent(content);
    },
    [onEditorContent, editorContent]
  );

  function handleEditorUpdate(editor: Editor) {
    setEditorContent(editor.getHTML());
    if (returnMarkdown) {
      console.log({ html: editor.getHTML() });

      updateHtml(editor.getHTML());
      getEditorContent(markdown);
    } else {
      getEditorContent(editor.getHTML());
    }
  }

  return (
    <Box py={3}>
      <EditorProvider
        onUpdate={({ editor }) => {
          // @ts-ignore
          handleEditorUpdate(editor);
        }}
        slotBefore={<MenuBar />}
        content={editorContent}
        extensions={extensions}
      />
    </Box>
  );
}
