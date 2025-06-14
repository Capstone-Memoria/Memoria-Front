import HardBreak from "@tiptap/extension-hard-break";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { BubbleMenu, Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import Toolbar from "./Toolbar";

interface TiptapProps {
  content?: string; // HTML 형식의 초기 콘텐츠
  placeholder?: string; // 플레이스홀더 텍스트
  onContentUpdate?: (html: string) => void; // 콘텐츠 변경 시 호출될 콜백 함수
  onEditorReady?: (editor: Editor) => void; // 에디터가 준비되었을 때 호출될 콜백 함수
}

const Tiptap: React.FC<TiptapProps> = ({
  content = "",
  placeholder = "내용을 입력해주세요",
  onContentUpdate,
  onEditorReady,
}) => {
  const [isCursorNearBottom, setIsCursorNearBottom] = useState(false);

  const extensions = [
    StarterKit.configure({
      // 기본 HardBreak를 비활성화하고 커스텀 설정 사용
      hardBreak: false,
    }),
    HardBreak.configure({
      // Shift+Enter로 hard break 생성
      HTMLAttributes: {
        class: "hard-break",
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right"],
      defaultAlignment: "left",
    }),
  ];

  const editor = useEditor({
    extensions,
    content: content || "<p></p>", // 빈 content일 때 기본 paragraph 제공
    editorProps: {
      attributes: {
        class: "prose focus:outline-none min-h-[200px] max-w-none",
      },
      handleKeyDown: (view, event) => {
        // Enter 키 처리
        if (event.key === "Enter") {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          // Shift+Enter는 hard break 생성
          if (event.shiftKey) {
            return false; // HardBreak 확장이 처리하도록 함
          }

          // 일반 Enter 처리 - 항상 새로운 paragraph 생성 허용
          return false; // 기본 동작 허용
        }

        return false;
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

  // 에디터가 준비되면 콜백 함수 호출
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  const handleWrapperClick = () => {
    if (editor) {
      // 커서 위치를 문서 끝으로 이동하고 포커스
      const { state } = editor;
      const { doc } = state;
      const endPos = doc.content.size;

      // 에디터 영역이 이미 포커스 상태가 아닐 때만 포커스 호출
      if (!editor.isFocused) {
        editor.commands.focus(endPos);
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={"relative h-full w-full"}>
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
