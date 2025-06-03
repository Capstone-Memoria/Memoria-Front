import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { EmotionType } from "@/models/Diary";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction } from "react";

// 감정 목록 정의
const emotions = [
  { id: 1, name: "happy", label: "행복", type: EmotionType.HAPPY },
  { id: 2, name: "sad", label: "슬픔", type: EmotionType.SAD },
  { id: 3, name: "angry", label: "화남", type: EmotionType.ANGRY },
  { id: 4, name: "disgusted", label: "역겨움", type: EmotionType.DISGUSTED },
  { id: 5, name: "relaxed", label: "여유", type: EmotionType.RELAXED },
  { id: 6, name: "bored", label: "지루함", type: EmotionType.BORED },
  { id: 7, name: "loving", label: "사랑", type: EmotionType.LOVING },
  { id: 8, name: "kind", label: "친절", type: EmotionType.KIND },
  { id: 9, name: "ambitious", label: "야망", type: EmotionType.AMBITIOUS },
  { id: 10, name: "supersad", label: "우울", type: EmotionType.SUPERSAD },
  { id: 11, name: "bad", label: "나쁨", type: EmotionType.BAD },
  { id: 12, name: "sick", label: "아픔", type: EmotionType.SICK },
];

interface EmotionDrawerProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSelectEmotion: (emotionType: EmotionType) => void;
  selectedEmotion: EmotionType | null;
  date?: DateTime; // 선택적 날짜 파라미터
  isEditMode?: boolean; // 수정 모드 여부
}

const EmotionDrawer = ({
  isOpen,
  onOpenChange,
  onSelectEmotion,
  selectedEmotion,
  date,
  isEditMode = false,
}: EmotionDrawerProps) => {
  // 현재 날짜와 요일 (한국어 로케일 적용)
  const now = date ? date.setLocale("ko") : DateTime.now().setLocale("ko");
  const formattedDate = now.toFormat("yyyy.MM.dd");
  const formattedDayOfWeek = now.toFormat("cccc");

  // 감정 선택 핸들러
  const handleSelectEmotion = (
    emotionName: string,
    emotionType: EmotionType
  ) => {
    onSelectEmotion(emotionType);
    onOpenChange(false);
  };

  // 감정 목록을 3개씩 4줄로 나누기
  const emotionRows = [];
  for (let i = 0; i < emotions.length; i += 3) {
    emotionRows.push(emotions.slice(i, i + 3));
  }

  // 이미지 경로 생성 함수
  const getEmotionImagePath = (emotionName: string) => {
    return new URL(
      `../../../assets/images/emotions/${emotionName}.png`,
      import.meta.url
    ).href;
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className={"px-5 pb-10 flex flex-col items-center"}>
        {/* 날짜와 요일 표시 */}
        <div className={"text-xs md:text-sm pt-5 text-gray-400"}>
          {formattedDate} {formattedDayOfWeek}
        </div>
        <div className={"pb-5 md:text-lg mt-1"}>
          {isEditMode ? `이날의 감정은 어땠나요?` : `오늘은 어떤 하루였나요?`}
        </div>
        <div className={"w-full space-y-4 px-2"}>
          {emotionRows.map((row, rowIndex) => (
            <div key={rowIndex} className={"grid grid-cols-3 gap-4"}>
              {row.map((emotion) => (
                <div
                  key={emotion.id}
                  className={"flex flex-col items-center gap-2"}
                  onClick={() =>
                    handleSelectEmotion(emotion.name, emotion.type)
                  }
                >
                  <div
                    className={`size-fit rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      selectedEmotion === emotion.type
                        ? "bg-emerald-100 ring-2 ring-emerald-500"
                        : ""
                    }`}
                  >
                    <img
                      src={getEmotionImagePath(emotion.name)}
                      alt={emotion.label}
                      className={
                        "size-18 object-contain md:size-24 pointer-events-none"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EmotionDrawer;
