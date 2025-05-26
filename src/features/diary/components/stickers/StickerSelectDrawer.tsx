import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoTimeOutline } from "react-icons/io5";
import { PRESET_STICKER_OPTIONS } from "../../data/sticker";
import { StickerCategory, StickerOption } from "../../models/StickerData";

// 스티커 탭 이미지 import
import StickerTab1 from "@/assets/images/StickerTab1.png";
import StickerTab2 from "@/assets/images/StickerTab2.png";
import StickerTab3 from "@/assets/images/StickerTab3.png";
import StickerTab4 from "@/assets/images/StickerTab4.png";
import StickerTab5 from "@/assets/images/StickerTab5.png";

interface StickerSelectDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (sticker: StickerOption) => void;
}

type DisplayStickerCategory = "recent" | StickerCategory;

const MAX_RECENT_STICKERS = 10;

const StickerSelectDrawer: React.FC<StickerSelectDrawerProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<DisplayStickerCategory>("alphabet");
  const [recentUsedStickers, setRecentUsedStickers] = useState<StickerOption[]>(
    []
  );

  useEffect(() => {
    const storedRecentStickers = localStorage.getItem("recentUsedStickers");
    if (storedRecentStickers) {
      try {
        const parsedStickers = JSON.parse(storedRecentStickers);
        setRecentUsedStickers(parsedStickers);
      } catch (error) {
        console.error(
          "Failed to parse recent stickers from localStorage:",
          error
        );
      }
    }
  }, []);

  const updateRecentStickers = useCallback((sticker: StickerOption) => {
    setRecentUsedStickers((prevStickers: StickerOption[]): StickerOption[] => {
      const existingIndex = prevStickers.findIndex((s) => s.id === sticker.id);
      let newStickers: StickerOption[];

      if (existingIndex !== -1) {
        newStickers = [
          sticker,
          ...prevStickers.slice(0, existingIndex),
          ...prevStickers.slice(existingIndex + 1),
        ];
      } else {
        newStickers = [sticker, ...prevStickers];
      }

      if (newStickers.length > MAX_RECENT_STICKERS) {
        newStickers = newStickers.slice(0, MAX_RECENT_STICKERS);
      }

      localStorage.setItem("recentUsedStickers", JSON.stringify(newStickers));

      return newStickers;
    });
  }, []);

  const handleStickerSelect = useCallback(
    (sticker: StickerOption) => {
      updateRecentStickers(sticker);
      onSelect(sticker);
    },
    [onSelect, updateRecentStickers]
  );

  const stickerCategories: Record<DisplayStickerCategory, StickerOption[]> =
    useMemo(() => {
      const presetStickers = PRESET_STICKER_OPTIONS.reduce(
        (acc, option) => {
          acc[option.category] = [...(acc[option.category] || []), option];
          return acc;
        },
        {} as Record<StickerCategory, StickerOption[]>
      );

      return {
        ...presetStickers,
        recent: recentUsedStickers,
      };
    }, [recentUsedStickers]);

  const categoryTabs: Record<
    DisplayStickerCategory,
    { icon?: React.ReactNode; image?: string; label: string }
  > = {
    recent: {
      icon: <IoTimeOutline className={"text-2xl"} />,
      label: "최근 사용",
    },
    alphabet: { image: StickerTab1, label: "알파벳" },
    alphabet2: { image: StickerTab2, label: "알파벳2" },
    deco: { image: StickerTab5, label: "데코" },
    month: { image: StickerTab3, label: "월" },
    colorchip: { image: StickerTab4, label: "컬러칩" },
    shape: { image: StickerTab2, label: "도형" },
    character: { image: StickerTab3, label: "캐릭터" },
    character2: { image: StickerTab4, label: "캐릭터2" },
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={"h-[39vh] min-h-[45%]"}>
        <div className={"p-4 px-4"}>
          <div
            className={
              "flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-2 border-b border-gray-200"
            }
          >
            <div className={"flex gap-3 min-w-max"}>
              {Object.entries(categoryTabs).map(
                ([category, { icon, image, label }]) => (
                  <div
                    onClick={() =>
                      setSelectedCategory(category as DisplayStickerCategory)
                    }
                    className={cn(
                      "transition-all flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-md overflow-hidden",
                      {
                        "opacity-70": selectedCategory !== category,
                        "opacity-100 border border-green-600 bg-gray-50":
                          selectedCategory === category,
                      }
                    )}
                    key={category}
                    title={label}
                  >
                    {icon ? (
                      icon
                    ) : (
                      <img
                        src={image}
                        alt={label}
                        className={"object-cover w-full h-full"}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div
          className={
            "mt-2 grid grid-cols-5 gap-5 place-items-center overflow-y-auto pb-8 px-4"
          }
        >
          <AnimatePresence mode={"popLayout"}>
            {stickerCategories[selectedCategory]?.length > 0
              ? stickerCategories[selectedCategory].map((sticker) => (
                  <motion.div
                    key={sticker.id}
                    className={"size-12"}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => handleStickerSelect(sticker)}
                  >
                    <img
                      src={sticker.imageUrl}
                      alt={sticker.id}
                      className={"size-full object-contain"}
                    />
                  </motion.div>
                ))
              : selectedCategory === "recent" && (
                  <div className={"col-span-5 text-center text-gray-500 py-8"}>
                    최근 사용한 스티커가 없습니다.
                  </div>
                )}
          </AnimatePresence>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StickerSelectDrawer;
