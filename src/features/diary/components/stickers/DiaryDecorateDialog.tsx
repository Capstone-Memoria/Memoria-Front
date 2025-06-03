import "@/assets/css/transitions.css";
import LoadingOverlay from "@/components/base/LoadingOverlay";
import DiaryCover, { DiaryCoverItem } from "@/components/diary/DiaryCover";
import TextStickerEditDrawer from "@/features/diary/components/stickers/TextStickerEditDrawer";
import { cn } from "@/lib/utils";
import {
  CustomTextSticker,
  ImageToUploadSticker,
  ModifyingSticker,
  PredefinedSticker,
} from "@/models/Sticker";
import { useElementSize } from "@reactuses/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoSmiley } from "react-icons/go";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { RiArrowGoBackLine, RiArrowGoForwardLine } from "react-icons/ri";
import { RxImage, RxText } from "react-icons/rx";
import { v4 as uuidv4 } from "uuid";
import { StickerOption } from "../../models/StickerData";
import StickerSelectDrawer from "./StickerSelectDrawer";
import TransformableSticker from "./TransformableSticker";

interface DiaryDecorateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCover: DiaryCoverItem | null;
  initialStickers?: ModifyingSticker[];
  onSave?: (stickers: ModifyingSticker[]) => void;
  spineColor?: string;
}

const DiaryDecorateDialog = ({
  open,
  onOpenChange,
  selectedCover,
  initialStickers,
  onSave,
  spineColor,
}: DiaryDecorateDialogProps) => {
  const [stickerDrawerOpen, setStickerDrawerOpen] = useState(false);
  const [textStickerDrawerOpen, setTextStickerDrawerOpen] = useState(false);
  const [stickers, setStickers] = useState<ModifyingSticker[]>([]);
  const [focusedStickerUuid, setFocusedStickerUuid] = useState<string | null>(
    null
  );
  const [editingStickerUuid, setEditingStickerUuid] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasSize = useElementSize(canvasRef);
  const bodySize = useElementSize(document.body);

  // 컴포넌트가 언마운트되거나 open 상태가 변경될 때 로딩 상태를 초기화
  useEffect(() => {
    if (!open) {
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  const coverSize = useMemo(() => {
    if (!canvasSize) return { width: 0, height: 0 };

    const coverWidth = canvasSize[0];
    const coverHeight = canvasSize[0] * (10 / 7);

    if (canvasSize[1] < coverHeight) {
      const coverHeight = canvasSize[1];
      const coverWidth = coverHeight * (7 / 10);
      return { width: coverWidth, height: coverHeight };
    }

    return { width: coverWidth, height: coverHeight };
  }, [canvasSize, bodySize]);

  useEffect(() => {
    if (open && initialStickers && coverSize.width > 0) {
      const adjustedStickers = initialStickers.map((sticker) => {
        if (
          sticker.type === "CUSTOM_TEXT" &&
          sticker.templateWidth &&
          sticker.templateWidth > 0
        ) {
          const currentFontSize = sticker.fontSize;
          const templateWidth = sticker.templateWidth;
          const newFontSize =
            (currentFontSize / templateWidth) * coverSize.width;
          return {
            ...sticker,
            fontSize: newFontSize,
          };
        }
        return sticker;
      });
      setStickers(adjustedStickers);
    } else if (open && initialStickers) {
      setStickers(initialStickers);
    }
  }, [open, initialStickers, coverSize.width]);

  const handleStickerSelect = (sticker: StickerOption) => {
    const newSticker: PredefinedSticker = {
      uuid: uuidv4(),
      type: "PREDEFINED",
      assetName: sticker.id,
      posX: 0.5,
      posY: 0.5,
      size: 0.3,
      rotation: 0,
    };
    setStickerDrawerOpen(false);
    setStickers((prev) => [...prev, newSticker]);
    setFocusedStickerUuid(newSticker.uuid);
  };

  const handleAddTextSticker = () => {
    // 텍스트 스티커 직접 생성
    const newSticker: CustomTextSticker = {
      uuid: uuidv4(),
      type: "CUSTOM_TEXT",
      textContent: "텍스트",
      fontSize: 16,
      fontColor: "#000000",
      fontFamily: "sans-serif",
      italic: false,
      bold: false,
      posX: 0.5,
      posY: 0.5,
      size: 0.3,
      rotation: 0,
      templateWidth: coverSize.width,
    };
    setStickers((prev) => [...prev, newSticker]);
    setFocusedStickerUuid(newSticker.uuid);
    // 텍스트 스티커 생성 후 바로 편집 모드로 전환
    setEditingStickerUuid(newSticker.uuid);
    setTextStickerDrawerOpen(true);
  };

  const handleTextStickerEdit = (textStickerData: {
    content: string;
    textStyle: {
      fontSize: number;
      color: string;
      fontFamily: string;
      fontWeight: string;
      fontStyle: string;
    };
  }) => {
    if (!editingStickerUuid) return;

    // 텍스트 스티커 편집 내용 저장
    setStickers((prev) =>
      prev.map((s) => {
        if (s.uuid === editingStickerUuid && s.type === "CUSTOM_TEXT") {
          return {
            ...s,
            textContent: textStickerData.content,
            fontSize: textStickerData.textStyle.fontSize,
            fontColor: textStickerData.textStyle.color,
            fontFamily: textStickerData.textStyle.fontFamily,
            bold: textStickerData.textStyle.fontWeight === "bold",
            italic: textStickerData.textStyle.fontStyle === "italic",
          };
        }
        return s;
      })
    );

    // 편집 상태 초기화
    setTextStickerDrawerOpen(false);
    setEditingStickerUuid(null);
  };

  const handleImageUpload = () => {
    // 이미지 업로드 처리 로직
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (!event.target?.result) return;

        const newSticker: ImageToUploadSticker = {
          uuid: uuidv4(),
          type: "IMAGE_TO_UPLOAD",
          imageFile: file,
          posX: 0.5,
          posY: 0.5,
          size: 0.3,
          rotation: 0,
        };

        setStickers((prev) => [...prev, newSticker]);
        setFocusedStickerUuid(newSticker.uuid);
      };

      reader.readAsDataURL(file); // FileReader는 여전히 DataURL을 읽어 미리보기를 위해 사용될 수 있지만, 실제 저장은 File 객체로 합니다.
    };

    input.click();
  };

  const handleStickerMove = (
    sticker: ModifyingSticker,
    newPosX: number,
    newPosY: number
  ) => {
    setStickers((prev) =>
      prev.map((s) =>
        s.uuid === sticker.uuid ? { ...s, posX: newPosX, posY: newPosY } : s
      )
    );
  };

  const handleStickerScaleAndRotate = (
    sticker: ModifyingSticker,
    newScale: number,
    newRotation: number
  ) => {
    setStickers((prev) =>
      prev.map((s) =>
        s.uuid === sticker.uuid
          ? { ...s, size: newScale, rotation: newRotation }
          : s
      )
    );
  };

  const handleStickerDelete = (stickerToDelete: ModifyingSticker) => {
    setStickers((prev) => prev.filter((s) => s.uuid !== stickerToDelete.uuid));
    setFocusedStickerUuid(null);
  };

  const handleStickerFocus = (sticker: ModifyingSticker) => {
    setFocusedStickerUuid(sticker.uuid);
    setStickers((prevStickers) => {
      const newStickers = prevStickers.filter((s) => s.uuid !== sticker.uuid);
      newStickers.push(sticker);
      return newStickers;
    });
  };

  const handleStickerDoubleClick = (sticker: ModifyingSticker) => {
    // 텍스트 스티커일 경우 편집 모드로 전환
    if (sticker.type === "CUSTOM_TEXT") {
      setEditingStickerUuid(sticker.uuid);
      setTextStickerDrawerOpen(true);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".absolute.z-10")) {
      return;
    }
    setFocusedStickerUuid(null);
  };

  const handleSave = () => {
    setIsLoading(true);

    // 실제 API를 통해 저장 - onSave 콜백 사용
    if (onSave) {
      // onSave 함수 호출 - CreateDiaryPage에서는 useMutation의 mutate 함수가 전달됨
      // 이 함수는 내부적으로 API 호출을 처리하고 navigate('/main')을 수행함
      // 성공하면 페이지가 이동하고, 실패하면 alert가 표시됨
      onSave(stickers);

      // 실패 시에도 로딩 상태를 제거하기 위해 타임아웃 설정
      // 일반적으로 API 호출이 실패하면 5초 이내에 응답이 오므로,
      // 10초가 지나도 응답이 없으면 로딩 상태를 해제하여 사용자가 다시 시도할 수 있게 함
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 10000);

      // 클린업 함수 (컴포넌트가 언마운트되면 타임아웃 제거)
      return () => clearTimeout(timeoutId);
    } else {
      // onSave가 없는 경우 (API 연결이 없는 경우)
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  // 현재 편집 중인 텍스트 스티커 찾기
  const editingSticker = editingStickerUuid
    ? stickers.find((s) => s.uuid === editingStickerUuid)
    : null;

  const currentEditingTextSticker =
    editingSticker && editingSticker.type === "CUSTOM_TEXT"
      ? (editingSticker as CustomTextSticker)
      : null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 h-full bg-white",
        "transition-transform duration-300 ease-expo-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <LoadingOverlay
        isLoading={isLoading}
        message={
          "잠시만 기다려주세요.\n메모리아가 여러분의 일기장을 만드는 중입니다."
        }
        tip={
          <>
            하루에 한 번 일기 쓰는 습관이
            <br />
            정서적 안정에 긍정적인 영향을 준다는 사실, 알고 계셨나요?
          </>
        }
      />

      <div
        className={`fixed inset-0 z-40 flex flex-col overflow-hidden h-full transition-opacity duration-300 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        <div className={"bg-white"}>
          <div className={"flex justify-between items-center p-4"}>
            <button className={"p-2 mr-1 rounded-full hover:bg-gray-100"}>
              <HiArrowNarrowLeft
                className={"text-2xl"}
                onClick={() => onOpenChange(false)}
              />
            </button>
            <h3 className={"text-lg font-medium select-none"}>일기장 꾸미기</h3>
            <button
              className={"p-2 rounded-full select-none"}
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </div>

        <div
          className={cn(
            "flex-1 flex items-center justify-center overflow-hidden touch-none"
          )}
          ref={canvasRef}
          onClick={handleCanvasClick}
        >
          <div
            className={"relative w-full h-full px-3 overflow-hidden"}
            style={{
              width: coverSize.width,
              height: coverSize.height,
            }}
          >
            <DiaryCover
              className={"relative z-0 pointer-events-none select-none"}
              item={
                selectedCover ?? {
                  type: "empty",
                }
              }
              spineColor={spineColor}
            />

            {stickers.map((sticker) => (
              <TransformableSticker
                key={sticker.uuid}
                sticker={sticker}
                isFocused={sticker.uuid === focusedStickerUuid}
                onStickerFocus={handleStickerFocus}
                onStickerDoubleClick={handleStickerDoubleClick}
                onScaleAndRotate={handleStickerScaleAndRotate}
                onMove={handleStickerMove}
                onDelete={handleStickerDelete}
              />
            ))}
          </div>
        </div>

        <div className={"bg-white border-t z-50"}>
          <div className={"flex justify-between items-center p-4"}>
            <div className={"flex gap-2"}>
              <button className={"p-2 rounded-full disabled:opacity-50"}>
                <RiArrowGoBackLine size={20} />
              </button>
              <button className={"p-2 rounded-full disabled:opacity-50"}>
                <RiArrowGoForwardLine size={20} />
              </button>
            </div>
            <div className={"flex gap-3 "}>
              <button
                className={"p-2 rounded-full antialiased"}
                onClick={handleAddTextSticker}
              >
                <RxText className={"text-2xl text-black"} />
              </button>
              <button
                className={"p-2 rounded-full antialiased"}
                onClick={handleImageUpload}
              >
                <RxImage className={"text-2xl text-black"} />
              </button>
              <button
                className={"p-2 rounded-full antialiased"}
                onClick={() => setStickerDrawerOpen(true)}
              >
                <GoSmiley className={"text-2xl text-black"} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <StickerSelectDrawer
        open={stickerDrawerOpen}
        onOpenChange={setStickerDrawerOpen}
        onSelect={(sticker) => {
          handleStickerSelect(sticker);
        }}
      />
      {currentEditingTextSticker && (
        <TextStickerEditDrawer
          open={textStickerDrawerOpen}
          onOpenChange={setTextStickerDrawerOpen}
          onSave={handleTextStickerEdit}
          initialText={currentEditingTextSticker.textContent}
          initialStyle={{
            fontSize: currentEditingTextSticker.fontSize,
            color: currentEditingTextSticker.fontColor,
            fontFamily: currentEditingTextSticker.fontFamily,
            fontWeight: currentEditingTextSticker.bold ? "bold" : "normal",
            fontStyle: currentEditingTextSticker.italic ? "italic" : "normal",
          }}
        />
      )}
    </div>
  );
};

export default DiaryDecorateDialog;
