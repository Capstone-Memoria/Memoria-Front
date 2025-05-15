import { cn } from "@/lib/utils";
import { Sticker } from "@/models/Sticker";

import { HTMLAttributes, useState } from "react";
import { MdClose } from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { PRESET_STICKER_OPTIONS } from "../../data/sticker";

interface TransformableStickerProps extends HTMLAttributes<HTMLDivElement> {
  sticker: Sticker;
  onMove: (item: Sticker, newPosX: number, newPosY: number) => void;
  onScaleAndRotate: (
    item: Sticker,
    newScale: number,
    newRotation: number
  ) => void;
  onDelete: (item: Sticker) => void;
  isFocused: boolean;
  onStickerFocus: (item: Sticker) => void;
}

const TransformableSticker = ({
  sticker,
  onMove,
  onScaleAndRotate,
  onDelete,
  isFocused,
  onStickerFocus,
}: TransformableStickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [isTransforming, setIsTransforming] = useState(false);
  const [transformInitPos, setTransformInitPos] = useState({ x: 0, y: 0 });
  const [transformInitStickerState, setTransformInitStickerState] = useState<{
    size: number;
    rotation: number;
  } | null>(null);

  const currentSticker = PRESET_STICKER_OPTIONS.find(
    (option) => option.id === sticker.stickerType
  );

  if (!currentSticker) {
    return null;
  }

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
    >
      <img
        onTouchStart={handleMoveTouchStart}
        onTouchMove={handleMoveTouchMove}
        onTouchEnd={handleMoveTouchEnd}
        src={currentSticker.imageUrl}
        alt={currentSticker.id}
      />
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
