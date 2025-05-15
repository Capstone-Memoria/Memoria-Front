import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { PRESET_STICKER_OPTIONS } from "../../data/sticker";
import { StickerCategory, StickerOption } from "../../models/StickerData";

interface StickerSelectDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (sticker: StickerOption) => void;
}

type DisplayStickerCategory = "recent" | StickerCategory;

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

  const categoryNames: Record<DisplayStickerCategory, string> = {
    recent: "최근 사용",
    alphabet: "알파벳",
    shape: "도형",
    character: "캐릭터",
    character2: "캐릭터2",
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={"min-h-[70%]"}>
        <div className={"p-4"}>
          <div className={"flex gap-2 overflow-x-auto scrollbar-hide pb-2"}>
            <div className={"flex gap-2 min-w-max"}>
              {Object.entries(categoryNames).map(([category, name]) => (
                <div
                  onClick={() =>
                    setSelectedCategory(category as StickerCategory)
                  }
                  className={cn(
                    "py-1 px-4 bg-gray-100 rounded-full transition-all text-sm flex-shrink-0",
                    {
                      "text-gray-500": selectedCategory !== category,
                      "text-white bg-green-500 ": selectedCategory === category,
                    }
                  )}
                  key={category}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={"mt-4 grid grid-cols-4 gap-5 place-items-center"}>
          <AnimatePresence mode={"popLayout"}>
            {stickerCategories[selectedCategory].map((sticker) => (
              <motion.div
                key={sticker.id}
                className={"size-12"}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => onSelect(sticker)}
              >
                <img
                  src={sticker.imageUrl}
                  alt={sticker.id}
                  className={"size-full object-contain"}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StickerSelectDrawer;
