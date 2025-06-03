import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

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
    md: "w-16 md:w-24 h-16 md:h-24",
    lg: "w-24 md:w-32 h-24 md:h-32",
  };

  // 원형 주변에 배치할 점의 개수
  const dotCount = 8;
  // 각 점의 크기
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 md:w-4 h-3 md:h-4",
    lg: "w-5 md:w-6 h-5 md:h-6",
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

  // 기본 반지름 값 (모바일)
  const baseRadiusValues = {
    sm: 4,
    md: 5.5,
    lg: 8,
  };

  // 큰 화면 반지름 값 (md 브레이크포인트 이상)
  const largeRadiusValues = {
    sm: 4,
    md: 7,
    lg: 10,
  };

  // 반응형을 위한 상태 추가
  const [isMdScreen, setIsMdScreen] = useState(false);

  // 화면 크기 변경 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMdScreen(window.innerWidth >= 768);
    };

    // 초기 확인
    checkScreenSize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", checkScreenSize);

    // 클린업
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 각 점의 위치 계산 (원형 배치)
  const getDotPosition = (index: number) => {
    const angle = (index / dotCount) * 2 * Math.PI;
    // 현재 화면 크기에 따라 반지름 선택
    const radius = isMdScreen
      ? largeRadiusValues[size]
      : baseRadiusValues[size];

    const x = 50 + radius * Math.cos(angle) * 10;
    const y = 50 + radius * Math.sin(angle) * 10;

    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
      animationDelay: `${(index / dotCount) * 0.8}s`,
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
