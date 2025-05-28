import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { BiBold, BiItalic, BiPalette } from "react-icons/bi";
import { GoDash, GoPlus } from "react-icons/go";
import { IoMdInformationCircle } from "react-icons/io";

export type TextStyle = {
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
};

interface TextStickerEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    content: string;
    textStyle: TextStyle;
  }) => void;
  initialText?: string;
  initialStyle?: TextStyle;
}

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

// 폰트 옵션
const FONT_OPTIONS = [
  { name: "기본", value: "sans-serif" },
  { name: "명조", value: "serif" },
  { name: "모노", value: "monospace" },
  { name: "필기체", value: "cursive" },
];

const TextStickerEditDrawer: React.FC<TextStickerEditDrawerProps> = ({
  open,
  onOpenChange,
  onSave,
  initialText = "",
  initialStyle = {
    fontWeight: "normal",
    fontStyle: "normal",
    fontSize: DEFAULT_FONT_SIZE,
    color: "#000000",
    fontFamily: "sans-serif",
  },
}) => {
  const [text, setText] = useState(initialText);
  const [textStyle, setTextStyle] = useState({
    fontWeight: initialStyle.fontWeight || "normal",
    fontStyle: initialStyle.fontStyle || "normal",
    fontSize: initialStyle.fontSize || DEFAULT_FONT_SIZE,
    color: initialStyle.color || "#000000",
    fontFamily: initialStyle.fontFamily || "sans-serif",
  });

  const handleSave = () => {
    if (!text.trim()) return;

    onSave({
      content: text,
      textStyle: textStyle,
    });
  };

  const toggleBold = () => {
    setTextStyle((prev) => ({
      ...prev,
      fontWeight: prev.fontWeight === "bold" ? "normal" : "bold",
    }));
  };

  const toggleItalic = () => {
    setTextStyle((prev) => ({
      ...prev,
      fontStyle: prev.fontStyle === "italic" ? "normal" : "italic",
    }));
  };

  const increaseFontSize = () => {
    setTextStyle((prev) => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 2, MAX_FONT_SIZE),
    }));
  };

  const decreaseFontSize = () => {
    setTextStyle((prev) => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 2, MIN_FONT_SIZE),
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextStyle((prev) => ({
      ...prev,
      color: e.target.value,
    }));
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextStyle((prev) => ({
      ...prev,
      fontFamily: e.target.value,
    }));
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerContent className={"min-h-[380px]"}>
        <div className={"p-4 flex flex-col gap-3 h-full"}>
          <h3
            className={
              "flex text-sm items-center gap-2 bg-gray-100 py-1 px-2 rounded-lg text-gray-500 w-fit"
            }
          >
            <IoMdInformationCircle />
            텍스트 스티커 내용을 입력해주세요.
          </h3>

          <div className={"flex flex-col gap-3 flex-1"}>
            {/* 텍스트 입력 필드 */}
            <input
              type={"text"}
              className={"w-full p-3 border rounded-md"}
              placeholder={"텍스트를 입력하세요..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* 스타일 컨트롤 */}
            <div
              className={
                "flex items-center justify-between gap-2 border rounded-md p-2"
              }
            >
              {/* 볼드, 이탤릭 버튼 */}

              <button
                onClick={toggleBold}
                className={cn(
                  "p-1.5 rounded-md border transition-colors",
                  textStyle.fontWeight === "bold"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                )}
                title={"굵게"}
              >
                <BiBold size={16} />
              </button>

              <button
                onClick={toggleItalic}
                className={cn(
                  "p-1.5 rounded-md border",
                  textStyle.fontStyle === "italic"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                )}
                title={"기울임"}
              >
                <BiItalic size={16} />
              </button>

              {/* 색상 선택 */}
              <div className={"relative flex items-center"}>
                <input
                  type={"color"}
                  value={textStyle.color}
                  onChange={handleColorChange}
                  className={"absolute opacity-0 w-full h-full cursor-pointer"}
                  title={"색상 선택"}
                />
                <button
                  className={cn(
                    "p-1.5 rounded-md border flex items-center gap-1"
                  )}
                >
                  <BiPalette size={16} />
                  <div
                    className={"w-3 h-3 rounded-full border border-black"}
                    style={{ backgroundColor: textStyle.color }}
                  ></div>
                </button>
              </div>

              {/* 폰트 선택 */}
              <select
                value={textStyle.fontFamily}
                onChange={handleFontChange}
                className={"p-1.5 border rounded-md text-xs flex-grow max-w-28"}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>

              {/* 폰트 크기 조절 */}
              <div className={"flex items-center border rounded-md"}>
                <button
                  onClick={decreaseFontSize}
                  disabled={textStyle.fontSize <= MIN_FONT_SIZE}
                  className={cn(
                    "p-1.5 flex items-center justify-center",
                    textStyle.fontSize <= MIN_FONT_SIZE
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  )}
                  title={"글자 크기 줄이기"}
                >
                  <GoDash />
                </button>

                <div className={"px-1 flex items-center gap-1"}>
                  <span className={"text-xs"}>{textStyle.fontSize}</span>
                </div>

                <button
                  onClick={increaseFontSize}
                  disabled={textStyle.fontSize >= MAX_FONT_SIZE}
                  className={cn(
                    "p-1.5 flex items-center justify-center",
                    textStyle.fontSize >= MAX_FONT_SIZE
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  )}
                  title={"글자 크기 키우기"}
                >
                  <GoPlus />
                </button>
              </div>
            </div>

            {/* 미리보기 */}
            <div
              className={
                "mt-1 p-3 border rounded-md flex items-center justify-center flex-1 min-h-[80px]"
              }
            >
              <div
                style={{
                  fontWeight: textStyle.fontWeight,
                  fontStyle: textStyle.fontStyle,
                  fontSize: `${textStyle.fontSize}px`,
                  fontFamily: textStyle.fontFamily,
                  color: textStyle.color,
                  wordBreak: "break-word",
                  textAlign: "center",
                  maxWidth: "100%",
                }}
              >
                {text || "텍스트 미리보기"}
              </div>
            </div>

            {/* 완료 버튼 */}
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className={cn(
                "mt-1 p-3 rounded-md text-white flex items-center justify-center",
                text.trim() ? "bg-black" : "bg-gray-300"
              )}
            >
              완료
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TextStickerEditDrawer;
