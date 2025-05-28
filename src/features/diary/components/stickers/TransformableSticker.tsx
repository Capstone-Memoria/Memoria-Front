import { cn } from "@/lib/utils";
import {
  CustomTextSticker,
  ModifyingSticker,
  PredefinedSticker,
} from "@/models/Sticker";

import { PRESET_STICKER_OPTIONS } from "@/features/diary/data/sticker";
import { HTMLAttributes, useState } from "react";
import { MdClose } from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";

interface TransformableStickerProps extends HTMLAttributes<HTMLDivElement> {
  sticker: ModifyingSticker;
  onMove: (sticker: ModifyingSticker, newPosX: number, newPosY: number) => void;
  onScaleAndRotate: (
    sticker: ModifyingSticker,
    newScale: number,
    newRotation: number
  ) => void;
  onDelete: (sticker: ModifyingSticker) => void;
  isFocused: boolean;
  onStickerFocus: (sticker: ModifyingSticker) => void;
  onStickerDoubleClick: (sticker: ModifyingSticker) => void;
}

const TransformableSticker = ({
  sticker,
  onMove,
  onScaleAndRotate,
  onDelete,
  isFocused,
  onStickerFocus,
  onStickerDoubleClick,
  ...props
}: TransformableStickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [isTransforming, setIsTransforming] = useState(false);
  const [transformInitPos, setTransformInitPos] = useState({ x: 0, y: 0 });
  const [transformInitStickerState, setTransformInitStickerState] = useState<{
    size: number;
    rotation: number;
  } | null>(null);

  // 스티커 타입에 따라 다른 렌더링 처리
  const renderStickerContent = () => {
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
      return (
        <div
          className={
            "w-full h-full flex items-center justify-center overflow-hidden"
          }
          style={{
            fontSize: `${(sticker as CustomTextSticker).fontSize}px`,
            color: (sticker as CustomTextSticker).fontColor,
            fontFamily: (sticker as CustomTextSticker).fontFamily,
            fontStyle: (sticker as CustomTextSticker).italic
              ? "italic"
              : "normal",
            fontWeight: (sticker as CustomTextSticker).bold ? "bold" : "normal",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {(sticker as CustomTextSticker).textContent}
        </div>
      );
    } else if (sticker.type === "IMAGE_TO_UPLOAD") {
      // imageFile이 File 객체인 경우에만 URL.createObjectURL을 사용합니다.
      const imageUrl =
        sticker.imageFile instanceof File
          ? URL.createObjectURL(sticker.imageFile)
          : sticker.imageFile;
      return (
        <img
          src={imageUrl}
          alt={"이미지 스티커"}
          className={"w-full h-full object-contain"}
          draggable={"false"}
          onLoad={(e) => {
            // File 객체로부터 생성된 URL인 경우에만 revokeObjectURL을 호출합니다.
            if (sticker.imageFile instanceof File) {
              URL.revokeObjectURL(e.currentTarget.src);
            }
          }}
        />
      );
    }
    return null;
  };

  const handleMoveTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const { clientX, clientY } = e.touches[0];
    const leftTopPoint = e.currentTarget.getBoundingClientRect();
    const centerPoint = {
      x: leftTopPoint.left + leftTopPoint.width / 2,
      y: leftTopPoint.top + leftTopPoint.height / 2,
    };
    setDragOffset({
      x: clientX - centerPoint.x,
      y: clientY - centerPoint.y,
    });
    onStickerFocus(sticker);
    e.stopPropagation();
  };

  const handleMoveTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    //posX, posY는 0~1 사이의 값이므로 터치 이벤트에서 받은 값을 계산
    const { clientX, clientY } = e.touches[0];
    const parentRect = (
      e.currentTarget.parentElement?.parentElement as HTMLElement
    ).getBoundingClientRect();
    const newPosX =
      (clientX - parentRect.left - dragOffset.x) / parentRect.width;
    const newPosY =
      (clientY - parentRect.top - dragOffset.y) / parentRect.height;
    onMove(sticker, newPosX, newPosY);
    e.stopPropagation();
  };

  const handleMoveTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.stopPropagation();
  };

  const handleTransformTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsTransforming(true);
    const { clientX, clientY } = e.touches[0];
    setTransformInitPos({ x: clientX, y: clientY });
    setTransformInitStickerState({
      size: sticker.size,
      rotation: sticker.rotation,
    });
    onStickerFocus(sticker);
    e.stopPropagation();
  };

  const handleTransformTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTransforming || !transformInitStickerState) return;
    const { clientX, clientY } = e.touches[0];

    const canvasElement = e.currentTarget.parentElement
      ?.parentElement as HTMLElement;
    if (!canvasElement) return;
    const canvasRect = canvasElement.getBoundingClientRect();

    const stickerCenterXAbsolute =
      canvasRect.left + sticker.posX * canvasRect.width;
    const stickerCenterYAbsolute =
      canvasRect.top + sticker.posY * canvasRect.height;

    // --- 스케일 계산 ---
    const initialDistance = Math.sqrt(
      Math.pow(transformInitPos.x - stickerCenterXAbsolute, 2) +
        Math.pow(transformInitPos.y - stickerCenterYAbsolute, 2)
    );
    const currentDistance = Math.sqrt(
      Math.pow(clientX - stickerCenterXAbsolute, 2) +
        Math.pow(clientY - stickerCenterYAbsolute, 2)
    );

    let newScale = transformInitStickerState.size;
    if (initialDistance > 0.001) {
      // initialDistance가 매우 작은 경우 (0에 가까운 경우) 오류 방지
      newScale =
        transformInitStickerState.size * (currentDistance / initialDistance);
    }
    newScale = Math.max(0.05, Math.min(newScale, 5)); // 스케일 제한 (최소 5%, 최대 500%)

    // --- 회전 계산 ---
    const initialTouchAngleRad = Math.atan2(
      transformInitPos.y - stickerCenterYAbsolute,
      transformInitPos.x - stickerCenterXAbsolute
    );
    const currentTouchAngleRad = Math.atan2(
      clientY - stickerCenterYAbsolute,
      clientX - stickerCenterXAbsolute
    );
    const touchAngleDifferenceRad = currentTouchAngleRad - initialTouchAngleRad;
    const touchAngleDifferenceDeg = touchAngleDifferenceRad * (180 / Math.PI);

    const newRotation =
      transformInitStickerState.rotation + touchAngleDifferenceDeg;

    onScaleAndRotate(sticker, newScale, newRotation);
    e.stopPropagation();
  };

  const handleTransformTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsTransforming(false);
    setTransformInitStickerState(null);
    e.stopPropagation();
  };

  const handleDeleteClick = () => {
    onDelete(sticker);
  };

  const handleDoubleClick = () => {
    if (onStickerDoubleClick) {
      onStickerDoubleClick(sticker);
    }
  };

  return (
    <div
      className={cn("absolute z-10 border-3 rounded-md", {
        "border-green-500": isFocused,
        "border-transparent": !isFocused,
      })}
      style={{
        left: sticker.posX * 100 + "%",
        top: sticker.posY * 100 + "%",
        width: sticker.size * 100 + "%",
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
      }}
      {...props}
    >
      <div
        onTouchStart={handleMoveTouchStart}
        onTouchMove={handleMoveTouchMove}
        onTouchEnd={handleMoveTouchEnd}
        onDoubleClick={handleDoubleClick}
        className={"w-full h-full"}
      >
        {renderStickerContent()}
      </div>
      {isFocused && (
        <>
          <div
            className={
              "absolute flex items-center justify-center right-0 bottom-0 bg-white size-7 rounded-full border shadow-md translate-x-1/2 translate-y-1/2"
            }
            onTouchStart={handleTransformTouchStart}
            onTouchMove={handleTransformTouchMove}
            onTouchEnd={handleTransformTouchEnd}
          >
            <TbPointFilled className={"text-gray-500"} />
          </div>
          <div
            className={
              "absolute flex items-center justify-center left-0 bottom-0 bg-white size-7 rounded-full border shadow-md -translate-x-1/2 translate-y-1/2"
            }
            onTouchStart={(e) => e.stopPropagation()}
            onClick={handleDeleteClick}
          >
            <MdClose className={"text-red-500"} />
          </div>
        </>
      )}
    </div>
  );
};

export default TransformableSticker;
