import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";

const extensions = [
  Placeholder.configure({ placeholder: "내용을 입력해주세요" }),
  StarterKit,
];

const Tiptap = () => {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "prose focus:outline-none min-h-[200px]",
      },
    },
  });

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
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bold") ? "bg-gray-100" : ""}`}
          title={"굵게"}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("italic") ? "bg-gray-100" : ""}`}
          title={"기울임"}
        >
          <Italic size={16} />
        </button>
        <div className={"h-6 w-px bg-gray-200 mx-1"} />
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-100" : ""}`}
          title={"제목 1"}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-100" : ""}`}
          title={"제목 2"}
        >
          <Heading2 size={16} />
        </button>
        <div className={"h-6 w-px bg-gray-200 mx-1"} />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bulletList") ? "bg-gray-100" : ""}`}
          title={"글머리 기호"}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("orderedList") ? "bg-gray-100" : ""}`}
          title={"번호 매기기"}
        >
          <ListOrdered size={16} />
        </button>
      </BubbleMenu>
    </div>
  );
};

export default Tiptap;
