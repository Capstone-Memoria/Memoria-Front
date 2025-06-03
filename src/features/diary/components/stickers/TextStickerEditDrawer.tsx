import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { BiBold, BiItalic, BiPalette } from "react-icons/bi";
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
  onSave: (data: { content: string; textStyle: TextStyle }) => void;
  initialText?: string;
  initialStyle?: TextStyle;
}

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 96;

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
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextStyle((prev) => ({
      ...prev,
      fontSize: parseInt(e.target.value),
    }));
  };

  const updateFontSizeFromPosition = (clientX: number, sliderRect: DOMRect) => {
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - sliderRect.left) / sliderRect.width)
    );
    const newSize = Math.round(
      MIN_FONT_SIZE + (MAX_FONT_SIZE - MIN_FONT_SIZE) * percentage
    );
    setTextStyle((prev) => ({
      ...prev,
      fontSize: newSize,
    }));
  };

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const sliderRect = e.currentTarget.getBoundingClientRect();
    updateFontSizeFromPosition(e.clientX, sliderRect);
  };

  const handleSliderTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const sliderRect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    updateFontSizeFromPosition(touch.clientX, sliderRect);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const slider = document.querySelector(".custom-slider-container");
      if (slider) {
        const sliderRect = slider.getBoundingClientRect();
        updateFontSizeFromPosition(e.clientX, sliderRect);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;

      const slider = document.querySelector(".custom-slider-container");
      if (slider) {
        const sliderRect = slider.getBoundingClientRect();
        const touch = e.touches[0];
        updateFontSizeFromPosition(touch.clientX, sliderRect);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

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
    <>
      <style>{`
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          outline: none;
          transition: all 0.15s ease;
        }
        
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: grab;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
          transition: all 0.15s ease;
        }
        
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .custom-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
        }
        
        .custom-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: grab;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
          transition: all 0.15s ease;
        }
        
        .custom-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .custom-slider::-moz-range-thumb:active {
          cursor: grabbing;
        }
        
        .custom-slider::-moz-range-track {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
        }
        
        .custom-slider:focus {
          outline: none;
        }
        
        .custom-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
        }

        .custom-slider-container {
          cursor: pointer;
          padding: 8px 0;
          margin: -8px 0;
        }

        .custom-slider-container:hover .custom-slider {
          height: 10px;
        }

        .dragging {
          user-select: none;
          cursor: grabbing !important;
        }

        .dragging * {
          cursor: grabbing !important;
        }
      `}</style>
      <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
        <DrawerContent className={"min-h-[350px]"}>
          <div
            className={cn("p-4 flex flex-col h-full", isDragging && "dragging")}
          >
            <h3
              className={
                "flex text-sm items-center gap-2 bg-gray-100 py-1 px-2 rounded-lg text-gray-500 w-fit mb-3"
              }
            >
              <IoMdInformationCircle />
              텍스트 스티커 내용을 입력해주세요.
            </h3>

            {/* 메인 컨텐츠 영역 - flex-1로 남은 공간 차지 */}
            <div className={"flex flex-col gap-3 flex-1"}>
              {/* 텍스트 입력 필드 - 동적 높이 */}
              <div
                className={
                  "border rounded-md focus-within:border-green-500 overflow-hidden"
                }
              >
                <input
                  type={"text"}
                  className={
                    "w-full p-3 focus:outline-none bg-transparent text-center resize-none pt-4"
                  }
                  style={{
                    fontWeight: textStyle.fontWeight,
                    fontStyle: textStyle.fontStyle,
                    fontSize: `${Math.min(textStyle.fontSize, 48)}px`,
                    fontFamily: textStyle.fontFamily,
                    color: textStyle.color,
                    minHeight: "64px",
                    maxHeight: "120px",
                    lineHeight: "1.2",
                  }}
                  placeholder={"텍스트를 입력하세요."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {textStyle.fontSize > 48 && (
                  <div className={"px-3 pb-2"}>
                    <span className={"text-xs text-gray-500"}>
                      실제 크기: {textStyle.fontSize}px (미리보기는 최대 48px로
                      제한)
                    </span>
                  </div>
                )}
              </div>

              {/* 스타일 컨트롤 */}
              <div className={"flex flex-col gap-3"}>
                {/* 첫 번째 줄: 볼드, 이탤릭, 색상, 폰트 */}
                <div
                  className={
                    "flex items-center justify-between gap-2 border rounded-md p-2"
                  }
                >
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
                    <BiBold className={"size-5 md:size-6"} />
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
                    <BiItalic className={"size-5 md:size-6"} />
                  </button>

                  {/* 색상 선택 */}
                  <div className={"relative flex items-center"}>
                    <input
                      type={"color"}
                      value={textStyle.color}
                      onChange={handleColorChange}
                      className={
                        "absolute opacity-0 w-full h-full cursor-pointer"
                      }
                      title={"색상 선택"}
                    />
                    <button
                      className={cn(
                        "p-1.5 rounded-md border flex items-center gap-2"
                      )}
                    >
                      <BiPalette className={"size-5 md:size-6"} />
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
                    className={
                      "p-2 border rounded-md text-xs flex-grow max-w-32"
                    }
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 두 번째 줄: 폰트 크기 슬라이더 */}
                <div className={"border rounded-md p-3"}>
                  <div className={"flex items-center justify-between mb-3"}>
                    <label className={"text-sm text-gray-600"}>글자 크기</label>
                    <span
                      className={
                        "text-sm font-medium bg-gray-100 px-2 py-1 rounded"
                      }
                    >
                      {textStyle.fontSize}px
                    </span>
                  </div>
                  <div className={"relative"}>
                    <div
                      className={"custom-slider-container"}
                      onMouseDown={handleSliderMouseDown}
                      onTouchStart={handleSliderTouchStart}
                    >
                      <input
                        type={"range"}
                        min={MIN_FONT_SIZE}
                        max={MAX_FONT_SIZE}
                        value={textStyle.fontSize}
                        onChange={handleFontSizeChange}
                        className={"w-full custom-slider"}
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${((textStyle.fontSize - MIN_FONT_SIZE) / (MAX_FONT_SIZE - MIN_FONT_SIZE)) * 100}%, #e5e7eb ${((textStyle.fontSize - MIN_FONT_SIZE) / (MAX_FONT_SIZE - MIN_FONT_SIZE)) * 100}%, #e5e7eb 100%)`,
                        }}
                      />
                    </div>
                    {/* 최소/최대 값 표시 */}
                    <div
                      className={
                        "flex justify-between text-xs text-gray-400 mt-1"
                      }
                    >
                      <span>{MIN_FONT_SIZE}px</span>
                      <span>{MAX_FONT_SIZE}px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 완료 버튼 - 하단 고정 */}
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className={cn(
                "mt-4 p-3 rounded-md text-white flex items-center justify-center",
                text.trim() ? "bg-black" : "bg-gray-300"
              )}
            >
              완료
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default TextStickerEditDrawer;
