import Image from "@/components/base/Image"; // Image 컴포넌트를 가져옵니다.
import { PRESET_STICKER_OPTIONS } from "@/features/diary/data/sticker"; // 경로 확인 필요
import { cn } from "@/lib/utils";
import {
  CustomImageSticker,
  CustomTextSticker,
  PredefinedSticker,
  Sticker,
} from "@/models/Sticker"; // Sticker 모델 타입들을 가져옵니다.
import { HTMLAttributes, useMemo, useRef } from "react";

interface StaticStickerProps extends HTMLAttributes<HTMLDivElement> {
  sticker: Sticker;
  templateWidth: number;
}

const StaticSticker = ({
  sticker,
  templateWidth,
  ...props
}: StaticStickerProps) => {
  const stickerRef = useRef<HTMLDivElement>(null);

  // 스티커 타입에 따라 다른 렌더링 처리 (useMemo 사용)
  const renderStickerContent = useMemo(() => {
    if (sticker.type === "PREDEFINED") {
      const presetSticker = PRESET_STICKER_OPTIONS.find(
        (option) => option.id === (sticker as PredefinedSticker).assetName
      );
      if (!presetSticker) return null;
      return (
        <img
          src={presetSticker.imageUrl}
          alt={presetSticker.id}
          className={"w-full h-full object-contain"}
          draggable={"false"}
        />
      );
    } else if (sticker.type === "CUSTOM_TEXT") {
      const textSticker = sticker as CustomTextSticker;
      let fontSize = textSticker.fontSize; // 기본값

      if (
        textSticker.templateWidth &&
        templateWidth > 0 &&
        textSticker.templateWidth > 0 &&
        textSticker.size > 0
      ) {
        const factor = templateWidth / textSticker.templateWidth;
        fontSize = factor * textSticker.fontSize;
      }

      return (
        <div
          className={"w-full h-full flex items-center justify-center"}
          style={{
            fontSize: `${fontSize}px`,
            color: textSticker.fontColor,
            fontFamily: textSticker.fontFamily,
            fontStyle: textSticker.italic ? "italic" : "normal",
            fontWeight: textSticker.bold ? "bold" : "normal",
            whiteSpace: "pre-wrap",
            wordBreak: "keep-all",
          }}
        >
          {textSticker.textContent}
        </div>
      );
    } else if (sticker.type === "CUSTOM_IMAGE") {
      const imageSticker = sticker as CustomImageSticker;
      return (
        <Image
          imageId={imageSticker.imageFile.id}
          alt={"이미지 스티커"}
          imageClassName={"w-full h-full object-contain"}
          className={"w-full h-full bg-gray-100 size-20"}
          draggable={"false"}
        />
      );
    }
  }, [sticker, templateWidth]);

  return (
    <div
      {...props}
      ref={stickerRef}
      style={{
        position: "absolute",
        left: `${sticker.posX * 100}%`,
        top: `${sticker.posY * 100}%`,
        width: `${sticker.size * 100}%`, // 부모 크기 기준 스티커 크기
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
      }}
      className={cn("flex items-center justify-center")}
    >
      {renderStickerContent}
    </div>
  );
};

export default StaticSticker;
