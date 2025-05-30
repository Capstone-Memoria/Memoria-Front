import { cn } from "@/lib/utils";
import React from "react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "green" | "blue" | "red" | "yellow" | "purple" | "gray";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "",
  size = "md",
  color = "green",
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  // 원형 주변에 배치할 점의 개수
  const dotCount = 8;
  // 각 점의 크기
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-5 h-5",
  };

  // 색상 클래스 매핑
  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    gray: "bg-gray-500",
  };

  // 각 점의 위치 계산 (원형 배치)
  const getDotPosition = (index: number) => {
    const angle = (index / dotCount) * 2 * Math.PI;
    const radius = size === "sm" ? 4 : size === "md" ? 5.5 : 8; // 원의 반지름 (rem 단위)

    const x = 50 + radius * Math.cos(angle) * 10; // 50%를 중심으로 계산
    const y = 50 + radius * Math.sin(angle) * 10;

    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
      animationDelay: `${(index / dotCount) * 0.8}s`, // 0.8초 동안 모든 점이 애니메이션 되도록
    };
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={`relative ${sizeClasses[size]}`}>
        {Array.from({ length: dotCount }).map((_, index) => (
          <div
            key={index}
            className={cn(
              `absolute ${dotSizes[size]} rounded-full animate-pulse`,
              colorClasses[color]
            )}
            style={{
              ...getDotPosition(index),
              opacity: 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
