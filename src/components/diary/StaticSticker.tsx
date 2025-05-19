import { PRESET_STICKER_OPTIONS } from "@/features/diary/data/sticker"; // 경로 확인 필요
import { cn } from "@/lib/utils";
import { Sticker } from "@/models/Sticker";
import { HTMLAttributes } from "react";

interface StaticStickerProps extends HTMLAttributes<HTMLDivElement> {
  sticker: Sticker;
}

const StaticSticker: React.FC<StaticStickerProps> = ({ sticker, ...props }) => {
  const currentSticker = PRESET_STICKER_OPTIONS.find(
    (option) => option.id === sticker.stickerType
  );

  if (!currentSticker) {
    return null;
  }

  return (
    <div
      {...props}
      style={{
        position: "absolute",
        left: `${sticker.posX * 100}%`,
        top: `${sticker.posY * 100}%`,
        width: `${sticker.size * 100}%`, // 부모 크기 기준 스티커 크기
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
      }}
      className={cn("flex items-center justify-center")} // Tailwind CSS 클래스 추가 가능
    >
      <img src={currentSticker.imageUrl} alt={currentSticker.id} />
    </div>
  );
};

export default StaticSticker;
