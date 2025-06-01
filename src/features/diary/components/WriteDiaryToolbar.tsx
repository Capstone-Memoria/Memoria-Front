import { type TextAlignment } from "@/features/diary/pages/WriteDiaryPage";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { cn } from "@/lib/utils/className";
import { useScroll, useWindowScroll } from "@reactuses/core";
import { Editor } from "@tiptap/react";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiChevronDown,
  FiImage,
  FiItalic,
} from "react-icons/fi";
import { MdKeyboard } from "react-icons/md";

type Props = {
  className?: string;
};

const WriteDiaryToolbar: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  useVisualViewport();
  const scrolled = useWindowScroll();
  const bodyScroll = useScroll(document.body);

  // 하단 툴바에서 스크롤을 방지하는 로직
  useEffect(() => {
    const toolbarElement = toolbarRef.current;

    if (!toolbarElement) return;

    const preventScroll = (e: TouchEvent) => {
      // 터치 이벤트 전파 중단 및 기본 동작 방지
      e.stopPropagation();
      e.preventDefault();
    };

    // 터치 이벤트 리스너 등록
    toolbarElement.addEventListener("touchmove", preventScroll, {
      passive: false,
    });

    // 정리 함수
    return () => {
      toolbarElement.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  return createPortal(
    <div
      ref={toolbarRef}
      className={cn(
        "flex items-center justify-between h-[60px] py-3 px-4 border-t border-gray-200 bg-white shadow-top",
        "absolute left-0 right-0 z-10",
        className
      )}
      style={{
        top: `calc(var(--viewport-height) - 60px + ${scrolled.y + bodyScroll[1]}px)`,
      }}
    >
      {children}
    </div>,
    document.body
  );
};

type ImageButtonProps = {
  className?: string;
  onClick: () => void;
  editor?: Editor | null;
};

const ImageButton: React.FC<ImageButtonProps> = ({
  className,
  onClick,
  editor,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-gray-600 flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 toolbar-button",
        editor?.isActive("image") && "bg-gray-100",
        className
      )}
    >
      <FiImage className={"w-5 h-5"} />
    </button>
  );
};

type BoldButtonProps = {
  className?: string;
  onClick: () => void;
  isActive?: boolean;
  editor?: Editor | null;
};

const BoldButton: React.FC<BoldButtonProps> = ({
  className,
  onClick,
  isActive,
  editor,
}) => {
  const [internalIsActive, setInternalIsActive] = React.useState(false);

  React.useEffect(() => {
    if (editor) {
      const updateButtonState = () => {
        setInternalIsActive(editor.isActive("bold"));
      };
      editor.on("transaction", updateButtonState);
      // Initial state
      updateButtonState();
      return () => {
        editor.off("transaction", updateButtonState);
      };
    }
    setInternalIsActive(!!isActive);
  }, [editor, isActive]);

  const handleClick = () => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    } else {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "text-gray-600 flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 toolbar-button",
        internalIsActive ? "bg-gray-100" : "",
        className
      )}
      disabled={
        editor ? !editor.can().chain().focus().toggleBold().run() : false
      }
      title={"굵게"}
    >
      <FiBold className={"w-5 h-5"} />
    </button>
  );
};

type ItalicButtonProps = {
  className?: string;
  onClick: () => void;
  isActive?: boolean;
  editor?: Editor | null;
};

const ItalicButton: React.FC<ItalicButtonProps> = ({
  className,
  onClick,
  isActive,
  editor,
}) => {
  const [internalIsActive, setInternalIsActive] = React.useState(false);

  React.useEffect(() => {
    if (editor) {
      const updateButtonState = () => {
        setInternalIsActive(editor.isActive("italic"));
      };
      editor.on("transaction", updateButtonState);
      // Initial state
      updateButtonState();
      return () => {
        editor.off("transaction", updateButtonState);
      };
    }
    setInternalIsActive(!!isActive);
  }, [editor, isActive]);

  const handleClick = () => {
    if (editor) {
      editor.chain().focus().toggleItalic().run();
    } else {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "text-gray-600 flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 toolbar-button",
        internalIsActive ? "bg-gray-100" : "",
        className
      )}
      disabled={
        editor ? !editor.can().chain().focus().toggleItalic().run() : false
      }
      title={"기울임꼴"}
    >
      <FiItalic className={"w-5 h-5"} />
    </button>
  );
};

type AlignButtonProps = {
  className?: string;
  onClick: () => void;
  alignment: TextAlignment;
  editor?: Editor | null;
};

const AlignButton: React.FC<AlignButtonProps> = ({
  className,
  onClick,
  alignment,
  editor,
}) => {
  const [internalIsActive, setInternalIsActive] = React.useState(false);

  React.useEffect(() => {
    if (editor) {
      const updateButtonState = () => {
        setInternalIsActive(editor.isActive({ textAlign: alignment }));
      };
      editor.on("transaction", updateButtonState);
      // Initial state
      updateButtonState();
      return () => {
        editor.off("transaction", updateButtonState);
      };
    }
    // If editor is not available, we assume it's not active, or rely on external prop if provided.
    // For this component, we'll default to false if no editor.
    setInternalIsActive(false);
  }, [editor, alignment]);

  const handleClick = () => {
    if (editor) {
      editor.chain().focus().setTextAlign(alignment).run();
    } else {
      onClick();
    }
  };

  const getAlignmentIcon = () => {
    switch (alignment) {
      case "left":
        return <FiAlignLeft className={"w-5 h-5"} />;
      case "center":
        return <FiAlignCenter className={"w-5 h-5"} />;
      case "right":
        return <FiAlignRight className={"w-5 h-5"} />;
      default:
        return <FiAlignLeft className={"w-5 h-5"} />;
    }
  };

  const getAlignmentTitle = () => {
    switch (alignment) {
      case "left":
        return "왼쪽 정렬";
      case "center":
        return "가운데 정렬";
      case "right":
        return "오른쪽 정렬";
      default:
        return "왼쪽 정렬";
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "text-gray-600 flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 toolbar-button",
        internalIsActive ? "bg-gray-100" : "",
        className
      )}
      title={getAlignmentTitle()}
    >
      {getAlignmentIcon()}
    </button>
  );
};

type KeyboardButtonProps = {
  className?: string;
  onClick: () => void;
  isKeyboardOpen: boolean;
};

const KeyboardButton: React.FC<KeyboardButtonProps> = ({
  className,
  onClick,
  isKeyboardOpen,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-gray-600 flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 toolbar-button",
        isKeyboardOpen ? "bg-gray-100" : "",
        className
      )}
      title={isKeyboardOpen ? "키보드 닫기" : "키보드 열기"}
    >
      {isKeyboardOpen ? (
        <FiChevronDown className={"w-5 h-5"} />
      ) : (
        <MdKeyboard className={"w-5 h-5"} />
      )}
    </button>
  );
};

type ButtonGroupProps = {
  className?: string;
};

const ButtonGroup: React.FC<React.PropsWithChildren<ButtonGroupProps>> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>{children}</div>
  );
};

// 구분선 컴포넌트 추가
const Divider: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn("h-6 w-px bg-gray-200 mx-1", className)} />;
};

export default Object.assign(WriteDiaryToolbar, {
  ButtonGroup,
  ImageButton,
  BoldButton,
  ItalicButton,
  AlignButton,
  KeyboardButton,
  Divider,
});
