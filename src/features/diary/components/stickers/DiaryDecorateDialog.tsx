import DiaryCover, { DiaryCoverItem } from "@/components/diary/DiaryCover";
import { Sticker } from "@/models/Sticker";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { PiSmileyStickerFill } from "react-icons/pi";
import { RiArrowGoBackLine, RiArrowGoForwardLine } from "react-icons/ri";
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

  useEffect(() => {
    if (open && initialStickers) {
      setStickers(initialStickers);
    } else if (!open) {
      // Optionally reset stickers when dialog closes, or manage externally
      // setStickers([]);
    }
  }, [open, initialStickers]);

  const handleStickerSelect = (sticker: StickerOption) => {
    console.log("new sticker added", sticker);
    const newSticker: Sticker = {
      uuid: crypto.randomUUID(),
      stickerType: sticker.id,
      posX: 0.5,
      posY: 0.5,
      size: 0.3,
      rotation: 0,
    };
    setStickers((prev) => [...prev, newSticker]);
    setFocusedStickerUuid(newSticker.uuid);
    setStickerDrawerOpen(false);
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
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-40 h-full bg-white`}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1], // expo-out easing 적용
          }}
        >
          {/* 메인 다이얼로그 컨텐츠 */}
          <div
            className={`fixed inset-0 z-50 flex flex-col overflow-hidden h-full`}
          >
            {/* 헤더 - 고정 */}
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

            {/* 메인 컨텐츠 - 스크롤 가능 영역 */}
            <div
              className={
                "flex-1 overflow-auto flex items-center justify-center p-10"
              }
              onClick={handleCanvasClick}
            >
              <div className={"relative w-full overflow-hidden"}>
                <DiaryCover
                  className={"w-full h-full relative z-0"}
                  item={
                    selectedCover ?? {
                      type: "empty",
                    }
                  }
                  spineColor={spineColor}
                />
                <AnimatePresence>
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
                </AnimatePresence>
              </div>
            </div>

            {/* 하단 바 - 고정 */}
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
            onSelect={handleStickerSelect}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiaryDecorateDialog;
