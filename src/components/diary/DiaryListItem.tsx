import CommentIcon from "@/assets/svgs/Comment";
import { cn } from "@/lib/utils";
import { Diary } from "@/models/Diary";
import { Dot } from "lucide-react";
import { HTMLAttributes, useMemo } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Image from "../base/Image";

interface DiaryListItemProps extends HTMLAttributes<HTMLDivElement> {
  item: Diary;
}

const DiaryListItem: React.FC<DiaryListItemProps> = ({ item, ...props }) => {
  const navigate = useNavigate();

  const summary = useMemo(() => {
    const content = item.content;
    //content에서 HTML 태그 제거, 텍스트만 추출.
    const text = content.replace(/<[^>]*>?/g, "");
    //text에서 세 줄 추출, 텍스트만 추출
    const lines = text.split("\n").slice(0, 3);
    return lines.map((line) => line.replace(/<[^>]*>?/g, "")).join("\n");
  }, [item.content]);

  // 이미지 경로 생성 함수
  const getEmotionImagePath = (emotionName: string) => {
    return new URL(
      `../../assets/images/emotions/${emotionName}.png`,
      import.meta.url
    ).href;
  };

  const handleDiaryClick = () => {
    navigate(`/diary-book/${item.diaryBookId}/diary/${item.id}`);
  };

  return (
    <div
      {...props}
      className={cn(
        "flex bg-white overflow-hidden rounded-md border h-26 cursor-pointer",
        props.className
      )}
      onClick={handleDiaryClick}
    >
      <Image
        imageId={item.images?.[0]?.id}
        imageClassName={"object-cover"}
        className={
          "flex-shrink-0 h-full aspect-square bg-gray-200 flex justify-center items-center"
        }
      />
      <div className={"py-2 px-3 flex flex-col w-full "}>
        <div className={"flex items-center gap-1"}>
          <div className={"font-medium"}>{item.title}</div>
        </div>
        <div className={"text-xs text-gray-500 overflow-hidden"}>{summary}</div>
        <div className={"flex-1"} />
        <div className={"flex justify-between w-full"}>
          <div className={"flex gap-2 text-gray-600"}>
            <div className={"flex items-center gap-1 text-xs"}>
              {item.reactionCount && item.reactionCount > 0 ? (
                <IoMdHeart className={"text-xs text-red-500"} />
              ) : (
                <IoMdHeartEmpty className={"text-xs"} />
              )}
              <div>{item.reactionCount ?? 0}</div>
            </div>
            <div className={"flex justify-center items-center gap-1 text-xs"}>
              <CommentIcon className={"size-xs"} />
              <div>{item.commentCount ?? 0}</div>
            </div>
            {item.emotion && (
              <div className={"flex items-center gap-1 text-xs"}>
                <img
                  src={getEmotionImagePath(item.emotion.toLowerCase())}
                  alt={item.emotion}
                  className={"size-6 object-contain"}
                />
              </div>
            )}
          </div>
          <div className={"text-xs text-gray-600 flex items-center"}>
            <div>{item.createdBy?.nickName}</div>
            <Dot />
            <div>{item.createdAt.toRelative()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryListItem;
