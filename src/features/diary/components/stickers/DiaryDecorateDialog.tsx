import "@/assets/css/transitions.css";
import DiaryCover, { DiaryCoverItem } from "@/components/diary/DiaryCover";
import { cn } from "@/lib/utils";
import { Sticker } from "@/models/Sticker";
import { useElementSize } from "@reactuses/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { PiSmileyStickerFill } from "react-icons/pi";
import { RiArrowGoBackLine, RiArrowGoForwardLine } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { StickerOption } from "../../models/StickerData";
import StickerSelectDrawer from "./StickerSelectDrawer";
import TransformableSticker from "./TransformableSticker";

interface DiaryDecorateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCover: DiaryCoverItem | null;
  initialStickers?: Sticker[];
  onSave?: (stickers: Sticker[]) => void;
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
  const [stickers, setStickers] = useState<Sticker[]>(initialStickers || []);
  const [focusedStickerUuid, setFocusedStickerUuid] = useState<string | null>(
    null
  );
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasSize = useElementSize(canvasRef);
  const bodySize = useElementSize(document.body);

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
    if (open && initialStickers) {
      setStickers(initialStickers);
    }
  }, [open, initialStickers]);

  const handleStickerSelect = (sticker: StickerOption) => {
    const newSticker: Sticker = {
      uuid: uuidv4(),
      stickerType: sticker.id,
      posX: 0.5,
      posY: 0.5,
      size: 0.3,
      rotation: 0,
    };
    setStickerDrawerOpen(false);
    setStickers((prev) => [...prev, newSticker]);
    setFocusedStickerUuid(newSticker.uuid);
  };

  const handleStickerMove = (
    sticker: Sticker,
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
    sticker: Sticker,
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

  const handleStickerDelete = (stickerToDelete: Sticker) => {
    setStickers((prev) => prev.filter((s) => s.uuid !== stickerToDelete.uuid));
    setFocusedStickerUuid(null);
  };

  const handleStickerFocus = (sticker: Sticker) => {
    setFocusedStickerUuid(sticker.uuid);
    setStickers((prevStickers) => {
      const newStickers = prevStickers.filter((s) => s.uuid !== sticker.uuid);
      newStickers.push(sticker);
      return newStickers;
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".absolute.z-10")) {
      return;
    }
    setFocusedStickerUuid(null);
  };

  const handleSave = () => {
    onSave?.(stickers);
    onOpenChange(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 h-full bg-white",
        "transition-transform duration-300 ease-expo-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div
        className={`fixed inset-0 z-50 flex flex-col overflow-hidden h-full`}
      >
        <div className={"bg-white"}>
          <div className={"flex justify-between items-center p-4"}>
            <button className={"p-2 mr-1 rounded-full hover:bg-gray-100"}>
              <HiArrowNarrowLeft
                className={"text-2xl"}
                onClick={() => onOpenChange(false)}
              />
            </button>
            <h3 className={"text-lg font-medium"}>일기장 꾸미기</h3>
            <button
              className={"p-2 rounded-full hover:bg-gray-100"}
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </div>

        <div
          className={cn(
            "flex-1 flex items-center justify-center overflow-hidden"
          )}
          ref={canvasRef}
          onClick={handleCanvasClick}
        >
          <div
            className={"relative w-full h-full overflow-hidden"}
            style={{
              width: coverSize.width,
              height: coverSize.height,
            }}
          >
            <DiaryCover
              className={"relative z-0 px-3"}
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
              <button
                className={
                  "p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                }
                aria-label={"뒤로가기"}
              >
                <RiArrowGoBackLine size={20} />
              </button>
              <button
                className={
                  "p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                }
                aria-label={"앞으로가기"}
              >
                <RiArrowGoForwardLine size={20} />
              </button>
            </div>
            <button
              className={"p-2 rounded-full bg-green-500 antialiased"}
              aria-label={"스티커 목록 열기"}
              onClick={() => setStickerDrawerOpen(true)}
            >
              <PiSmileyStickerFill className={"text-2xl text-white"} />
            </button>
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
    </div>
  );
};

export default DiaryDecorateDialog;
