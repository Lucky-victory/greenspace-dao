import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useState } from "react";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import { Box } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import History from "@tiptap/extension-history";
export default () => {
  const [editorContent, setEditorContent] = useState<string>(`
      <h3 style="text-align:center">
        Devs Just Want to Have Fun by Cyndi Lauper
      </h3>
      <p style="text-align:center">
        I come home in the morning light<br>
        My mother says, <mark>“When you gonna live your life right?”</mark><br>
        Oh mother dear we’re not the fortunate ones<br>
        And devs, they wanna have fun<br>
        Oh devs just want to have fun</p>
      <p style="text-align:center">
        The phone rings in the middle of the night<br>
        My father yells, "What you gonna do with your life?"<br>
        Oh daddy dear, you know you’re still number one<br>
        But <s>girls</s>devs, they wanna have fun<br>
        Oh devs just want to have
      </p>
      <p style="text-align:center">
        That’s all they really want<br>
        Some fun<br>
        When the working day is done<br>
        Oh devs, they wanna have fun<br>
        Oh devs just wanna have fun<br>
        (devs, they wanna, wanna have fun, devs wanna have)
      </p>
    `);
  const extensions = [
    StarterKit,
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    Blockquote,
    Typography,

    Image,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight,
  ];
  function handleEditorUpdate(editor: Editor) {
    console.log({
      editor,
      content: editor.getHTML(),
      editorContent: editorContent,
    });
    setEditorContent(editor.getHTML());
  }
  return (
    <Box py={4}>
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
};
