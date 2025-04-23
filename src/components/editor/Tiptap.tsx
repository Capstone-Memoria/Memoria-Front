import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar";

const extensions = [
  Placeholder.configure({ placeholder: "내용을 입력해주세요" }),
  StarterKit,
];

const Tiptap = () => {
  const [isCursorNearBottom, setIsCursorNearBottom] = useState(false);

  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "prose focus:outline-none min-h-[200px]",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const checkCursorPosition = () => {
      const { view } = editor;
      const { state } = editor;
      const { selection } = state;

      if (selection.empty) {
        const cursorEndPos = selection.from;
        const cursorCoords = view.coordsAtPos(cursorEndPos);

        const editorRect = view.dom.getBoundingClientRect();

        const editorMiddleY = editorRect.top + editorRect.height / 2;

        const nearBottom = cursorCoords.bottom > editorMiddleY + 10;

        if (isCursorNearBottom !== nearBottom) {
          setIsCursorNearBottom(nearBottom);
        }
      }
    };

    editor.on("selectionUpdate", checkCursorPosition);

    return () => {
      editor.off("selectionUpdate", checkCursorPosition);
    };
  }, [editor, isCursorNearBottom]);

  const handleWrapperClick = () => {
    if (editor) {
      const { state } = editor;
      const { doc } = state;
      const endPos = doc.content.size;
      editor.commands.focus(endPos);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={"relative h-full"}>
      <div className={"h-full cursor-text"} onClick={handleWrapperClick}>
        <EditorContent editor={editor} />
      </div>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          placement: "bottom",
          offset: [0, 8],
        }}
        className={
          "bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-2"
        }
      >
        <Toolbar editor={editor} />
      </BubbleMenu>
      <motion.div
        layout
        className={cn("absolute w-fit flex left-1/2 -translate-x-1/2", {
          "bottom-0": !isCursorNearBottom,
          "top-0": isCursorNearBottom,
        })}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div
          className={
            "bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex"
          }
        >
          <Toolbar editor={editor} />
        </div>
      </motion.div>
    </div>
  );
};

export default Tiptap;
