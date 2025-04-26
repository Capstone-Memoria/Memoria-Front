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

interface TiptapProps {
  content?: string; // HTML 형식의 초기 콘텐츠
  onContentUpdate?: (html: string) => void; // 콘텐츠 변경 시 호출될 콜백 함수
}

const Tiptap: React.FC<TiptapProps> = ({ content = "", onContentUpdate }) => {
  const [isCursorNearBottom, setIsCursorNearBottom] = useState(false);

  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: "prose focus:outline-none min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      // 콘텐츠가 변경될 때마다 콜백 함수 호출
      if (onContentUpdate) {
        onContentUpdate(editor.getHTML());
      }
    },
  });

  // 외부에서 content prop이 변경될 경우 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

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
