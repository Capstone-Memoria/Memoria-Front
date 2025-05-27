"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  value,
  onValueChange,
  className,
}) => {
  const [localValue, setLocalValue] = useState<number[]>(
    value || defaultValue || [min]
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 외부에서 value가 변경될 경우 내부 상태 업데이트
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  // 값을 퍼센트로 변환 (CSS 위치 계산용)
  const valueToPercent = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  // 마우스/터치 위치를 값으로 변환
  const positionToValue = (position: number) => {
    if (!trackRef.current) return min;

    const trackRect = trackRef.current.getBoundingClientRect();
    const trackWidth = trackRect.width;
    const percent = Math.max(0, Math.min(1, position / trackWidth));
    const rawValue = min + percent * (max - min);

    // step에 맞춰 반올림
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    updateValueFromEvent(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current) {
      updateValueFromEvent(e.clientX);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    updateValueFromEvent(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      updateValueFromEvent(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  const updateValueFromEvent = (clientX: number) => {
    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const position = clientX - trackRect.left;
    const newValue = positionToValue(position);

    setLocalValue([newValue]);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  // 컴포넌트 언마운트 시 이벤트 리스너 제거
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative w-full h-8 flex items-center touch-none",
        className
      )}
    >
      <div
        ref={trackRef}
        className={
          "relative h-1.5 w-full rounded-full bg-gray-200 cursor-pointer"
        }
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className={"absolute h-full bg-green-500 rounded-full"}
          style={{
            width: `${valueToPercent(localValue[0])}%`,
          }}
        />
        <div
          className={
            "absolute h-4 w-4 rounded-full bg-white border border-gray-200 shadow transform -translate-y-1/4"
          }
          style={{
            left: `${valueToPercent(localValue[0])}%`,
            transform: "translateX(-50%) translateY(-25%)",
          }}
        />
      </div>
    </div>
  );
};

export default Slider;
