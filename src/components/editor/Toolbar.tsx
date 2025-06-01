import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <>
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
        title={"기울임꼴"}
      >
        <Italic size={16} />
      </button>
      <div className={"h-6 w-px bg-gray-200 mx-1"} />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-100" : ""}`}
        title={"제목 1"}
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
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
      <div className={"h-4 w-px bg-gray-200 mx-1"} />
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-100" : ""}`}
        title={"왼쪽 정렬"}
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-100" : ""}`}
        title={"가운데 정렬"}
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-100" : ""}`}
        title={"오른쪽 정렬"}
      >
        <AlignRight size={16} />
      </button>
    </>
  );
};

export default Toolbar;
