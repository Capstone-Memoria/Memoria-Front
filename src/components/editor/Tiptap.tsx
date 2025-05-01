import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar";

interface TiptapProps {
  content?: string; // HTML 형식의 초기 콘텐츠
  placeholder?: string; // 플레이스홀더 텍스트
  onContentUpdate?: (html: string) => void; // 콘텐츠 변경 시 호출될 콜백 함수
}

const Tiptap: React.FC<TiptapProps> = ({
  content = "",
  placeholder = "내용을 입력해주세요",
  onContentUpdate,
}) => {
  const [isCursorNearBottom, setIsCursorNearBottom] = useState(false);

  const extensions = [
    StarterKit,
    Placeholder.configure({
      placeholder,
    }),
  ];

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
    </div>
  );
};

export default Tiptap;
