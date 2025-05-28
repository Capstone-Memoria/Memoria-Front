import Image from "@/components/base/Image"; // Image 컴포넌트를 가져옵니다.
import { PRESET_STICKER_OPTIONS } from "@/features/diary/data/sticker"; // 경로 확인 필요
import { cn } from "@/lib/utils";
import {
  CustomImageSticker,
  CustomTextSticker,
  PredefinedSticker,
  Sticker,
} from "@/models/Sticker"; // Sticker 모델 타입들을 가져옵니다.
import { HTMLAttributes } from "react";

interface StaticStickerProps extends HTMLAttributes<HTMLDivElement> {
  sticker: Sticker; // BaseSticker 대신 Sticker 유니온 타입을 사용합니다.
}

const StaticSticker: React.FC<StaticStickerProps> = ({ sticker, ...props }) => {
  // 스티커 타입에 따라 다른 렌더링 처리
  const renderStickerContent = () => {
    if (sticker.type === "PREDEFINED") {
      const presetSticker = PRESET_STICKER_OPTIONS.find(
        (option) => option.id === (sticker as PredefinedSticker).assetName // stickerType 대신 assetName 사용
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
      return (
        <div
          className={"w-full h-full flex items-center justify-center"}
          style={{
            fontSize: `${textSticker.fontSize}px`,
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
      if (typeof imageSticker.imageFile === "string") {
        // imageFile이 문자열인 경우 imageId로 간주하여 Image 컴포넌트 사용
        return (
          <Image
            imageId={imageSticker.imageFile}
            alt={"이미지 스티커"}
            imageClassName={"w-full h-full object-contain"} // Image 컴포넌트 내부 img 태그에 적용될 클래스
            className={"w-full h-full bg-gray-100 size-20"} // Image 컴포넌트 자체의 div에 적용될 클래스
            draggable={"false"}
          />
        );
      } else if (imageSticker.imageFile instanceof File) {
        // imageFile이 File 객체인 경우 StaticSticker에서는 렌더링하지 않음 (또는 임시 URL로 표시 가능)
        // 여기서는 null을 반환하여 렌더링하지 않도록 처리합니다.
        // 만약 File 객체도 표시해야 한다면, URL.createObjectURL을 사용하는 이전 로직 활용 가능
        // console.warn("StaticSticker: CUSTOM_IMAGE 스티커의 imageFile이 File 객체입니다. 이는 StaticSticker에서 예상치 못한 상황일 수 있습니다.");
        return null;
      }
      return null; // 그 외의 경우 (예: imageFile이 undefined)
    }
    return null;
  };

  // BaseSticker의 공통 속성을 사용합니다.
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
      {renderStickerContent()}
    </div>
  );
};

export default StaticSticker;
