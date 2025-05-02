import { cn } from "@/lib/utils/className";
import { AttachedFile } from "@/models/AttachedFile";
import { HTMLAttributes } from "react";
import DiaryCover from "./DiaryCover";

interface DiaryBookProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  memberCount: number;
  pinned: boolean;
  notificationCount: number;
  coverImage?: AttachedFile | null; // 타입을 AttachedFile로 받음
}

const DiaryBook: React.FC<DiaryBookProps> = ({
  title,
  memberCount,
  pinned,
  notificationCount,
  coverImage,
  ...props
}) => {
  // --- 임시 이미지 URL 생성 로직 ---
  let imageUrl: string;

  if (coverImage && coverImage.id) {
    // ⭐️ 중요: 아래 URL 형식은 임시 예시입니다! ⭐️
    // 반드시 백엔드 개발자에게 실제 이미지 URL 생성 방법을 확인하고 수정해야 합니다.
    // 예시: 이미지 ID를 사용하는 API 엔드포인트가 있다고 가정
    imageUrl = `/api/images/${coverImage.id}`;
  } else {
    // 기본 이미지 경로 (실제 경로로 수정 필요)
    imageUrl = "/images/CoverImage1.png";
  }
  // --- 임시 이미지 URL 생성 로직 끝 ---

  return (
    <div
      {...props}
      className={cn(
        "flex flex-col w-full justify-center items-center cursor-pointer", // 클릭 가능하도록 cursor-pointer 추가 (MainPage에서 onClick 사용)
        props.className
      )}
    >
      <DiaryCover
        className={"mb-2"}
        pinned={pinned}
        notificationCount={notificationCount}
        // DiaryCover에는 생성된 이미지 URL(문자열) 전달
        imageSrc={imageUrl}
      />
      <p className={"text-[13px] font-medium"}>{title}</p>
      <p className={"text-[11px] font-light text-gray-1"}>
        멤버 {memberCount}명
      </p>
    </div>
  );
};

export default DiaryBook;
