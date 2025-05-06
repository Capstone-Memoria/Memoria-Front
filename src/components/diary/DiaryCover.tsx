import { cn } from "@/lib/utils/className";
import { HTMLAttributes, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Image from "../base/Image";

interface DiaryCoverProps extends HTMLAttributes<HTMLDivElement> {
  pinned?: boolean;
  showPin?: boolean;
  notificationCount?: number;
  coverColor?: string;
  imageSrc?: string;
  imageId?: string;
  imageFile?: File;
  title?: string;
}

const DiaryCover: React.FC<DiaryCoverProps> = ({
  pinned = false,
  showPin = true,
  coverColor = "bg-green-500",
  notificationCount,
  imageSrc,
  imageId,
  imageFile,
  title = "Diary Cover",
  ...props
}) => {
  const [fileObjectUrl, setFileObjectUrl] = useState<string | null>(null);

  // File 객체가 주어졌을 때 URL 생성
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setFileObjectUrl(objectUrl);

      // 컴포넌트 언마운트 시 URL 해제
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [imageFile]);

  const handleImageLoad = () => {
    // 이미지 로드 성공 시 동작
    console.log("Image loaded successfully");
  };

  const handleImageError = () => {
    // 이미지 로드 실패 시 동작
    console.error("Failed to load image");
  };

  return (
    // 1. 바깥쪽 div: 크기(w, h)와 상대 위치(relative)만 담당
    <div {...props} className={cn("w-22 h-32 relative", props.className)}>
      {/* 2. 내부 래퍼 div: 시각적 요소(배경, 그림자, 라운딩)와 내용(flex, overflow) 담당 */}
      <div
        className={cn(
          "w-full h-full flex rounded-r-md bg-gray-300 shadow-md overflow-hidden" // 시각적 스타일 + overflow-hidden 적용
        )}
      >
        {/* 표지 꾸미기에서 바뀌는 부분 (색상 바) */}
        <div
          className={cn(
            "w-[6%] min-w-[6px] max-w-[12px] h-full rounded-l-xs shrink-0",
            coverColor
          )}
        />
        {fileObjectUrl ? ( // File 객체로부터 생성된 URL이 있을 경우
          <img
            src={fileObjectUrl}
            className={"flex-1 h-full object-cover"}
            alt={`${title} cover image`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : imageSrc || imageId ? ( // imageSrc 또는 imageId 둘 중 하나라도 있다면
          imageSrc ? ( // imageSrc가 있다면 표준 img 태그 사용
            <img
              src={imageSrc}
              className={"flex-1 h-full object-cover"}
              alt={`${title} cover image`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            // imageSrc는 없고 imageId만 있다면 custom Image 컴포넌트 사용
            <Image
              className={"flex-1 h-full"}
              imageId={imageId}
              imageClassName={"object-cover"}
              alt={`${title} cover image`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )
        ) : (
          // 어떤 이미지 소스도 없다면 기본 배경 div 사용
          <div className={"size-full bg-green-200"}></div>
        )}
      </div>

      {showPin && pinned ? (
        <div
          className={
            "absolute top-0 left-[6px] rounded-t-[2px] -translate-y-[14px] px-[4px] pt-[3px] pb-[4px] bg-[#FFE539]"
          }
        >
          <FaStar className={"fill-gray-2 text-[7px]"} />
        </div>
      ) : null}
      {!!notificationCount && notificationCount > 0 && (
        <div
          className={
            "absolute top-0 right-0 min-w-5 h-5 translate-x-[calc(50%-3px)] -translate-y-[calc(50%-4px)] flex items-center justify-center bg-red-500 text-white font-normal text-[8px] p-1 rounded-full"
          }
        >
          {notificationCount > 99 ? "99+" : notificationCount}
        </div>
      )}
    </div> // 바깥쪽 div 끝
  );
};

export default DiaryCover;
