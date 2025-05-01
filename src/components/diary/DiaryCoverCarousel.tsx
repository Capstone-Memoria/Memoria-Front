// src/components/DiaryCoverCarousel.tsx
import CoverExampleImg1 from "@/assets/images/CoverImage1.png";
import CoverExampleImg2 from "@/assets/images/CoverImage2.png";
import CoverExampleImg3 from "@/assets/images/CoverImage3.jpg";
import CoverExampleImg4 from "@/assets/images/CoverImage4.png";
import CoverExampleImg5 from "@/assets/images/CoverImage5.jpg";
import { useCarouselInteraction } from "@/hooks/useCarouselInteraction"; // 커스텀 훅 import
import { cn } from "@/lib/utils/className"; // 경로는 실제 프로젝트에 맞게 수정하세요.
import React from "react"; // React import 추가
import DiaryCover from "./DiaryCover"; // 경로는 실제 프로젝트에 맞게 수정하세요.

interface DiaryCoverCarouselProps {
  className?: string;
  onSelect?: (index: number | string) => void; // 'uploaded' 문자열도 반환할 수 있도록 수정
  uploadedCoverUrl?: string | null; // 업로드된 이미지 URL
}

// 표시할 다이어리 데이터 (예시)
// 실제로는 props로 받거나 외부에서 가져올 수 있습니다.
const diaryPresets: Array<{
  id: number | string;
  coverColor: string;
  imageSrc: string;
}> = [
  {
    id: 1,
    coverColor: "bg-sky-500",
    imageSrc: CoverExampleImg1,
  },
  { id: 2, coverColor: "bg-black", imageSrc: CoverExampleImg2 },
  { id: 3, coverColor: "bg-sky-500", imageSrc: CoverExampleImg3 },
  { id: 4, coverColor: "bg-gray-700", imageSrc: CoverExampleImg4 },
  { id: 5, coverColor: "bg-gray-800", imageSrc: CoverExampleImg5 },
];

const DiaryCoverCarousel: React.FC<DiaryCoverCarouselProps> = ({
  className,
  onSelect,
  uploadedCoverUrl,
}) => {
  // 업로드된 이미지가 있으면 전체 아이템 개수 증가
  const totalItems = uploadedCoverUrl
    ? diaryPresets.length + 1
    : diaryPresets.length;

  const {
    potentialIndex,
    isDragging,
    isAnimating,
    containerRef,
    itemRef, // 첫 번째 아이템 측정을 위해 훅에서 받아옴
    getTranslateX,
    calculateItemStyle,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleIndicatorClick,
  } = useCarouselInteraction({
    itemCount: totalItems, // 업로드된 이미지가 있으면 포함한 총 아이템 수
    onSelect: (index) => {
      if (onSelect) {
        // 업로드된 이미지가 있고, 선택된 인덱스가 마지막 항목이면 'uploaded' 반환
        if (uploadedCoverUrl && index === diaryPresets.length) {
          onSelect("uploaded");
        } else {
          onSelect(index);
        }
      }
    },
  });

  // 모든 아이템 배열 준비 (프리셋 + 업로드된 이미지)
  const allItems = [...diaryPresets];
  if (uploadedCoverUrl) {
    allItems.push({
      id: "uploaded",
      coverColor: "bg-white",
      imageSrc: uploadedCoverUrl,
    });
  }

  return (
    <div className={"flex flex-col items-center"}>
      <div
        ref={containerRef} // 컨테이너 ref 연결
        className={cn(
          "relative w-full overflow-hidden cursor-grab touch-pan-x",
          isDragging ? "cursor-grabbing" : "", // 드래그 중 커서 변경
          className
        )}
        // 이벤트 핸들러 연결
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          // 이동 컨테이너 스타일링
          className={`flex ${
            // 애니메이션 중이고 드래그 중이 아닐 때만 transition 적용
            isAnimating && !isDragging
              ? "transition-transform duration-300 ease-out"
              : ""
          }`}
          style={{
            // translateX 계산 함수 사용 (훅이 내부적으로 actualItemWidth 확인)
            transform: `translateX(${getTranslateX()}px)`,
            willChange: "transform", // 성능 최적화 힌트
          }}
        >
          {allItems.map((item, index) => {
            // 각 아이템 스타일 계산 함수 사용
            const itemStyle = calculateItemStyle(index);

            return (
              <div
                // 첫 번째 아이템에만 itemRef 연결 (너비 측정용)
                ref={index === 0 ? itemRef : null}
                key={item.id}
                className={cn(
                  "flex-shrink-0 mx-6 select-none",
                  // 드래그 중이 아닐 때만 스케일/투명도 transition 적용
                  !isDragging ? "transition-all duration-300 ease-out" : ""
                )}
                style={{
                  ...itemStyle, // 계산된 스케일, 투명도 적용
                  willChange: "transform, opacity", // 성능 최적화 힌트
                }}
              >
                <DiaryCover
                  showPin={false}
                  className={"w-42 h-60 pointer-events-none"} // 내부 요소 이벤트 방지
                  coverColor={item.coverColor}
                  imageSrc={item.imageSrc} // 이미지 src (예시)
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 인디케이터 */}
      <div className={"flex justify-center mt-4"}>
        {allItems.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 mx-1 rounded-full cursor-pointer transition-colors duration-300",
              // 현재 인덱스에 따라 스타일 변경
              potentialIndex === index
                ? "bg-gray-800"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            // 인디케이터 클릭 핸들러 연결
            onClick={() => handleIndicatorClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DiaryCoverCarousel;
