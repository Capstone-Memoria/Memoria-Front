import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dispatch, SetStateAction } from "react";

// 감정 목록 정의
const emotions = [
  { id: 1, name: "happy", label: "행복" },
  { id: 2, name: "sad", label: "슬픔" },
  { id: 3, name: "angry", label: "화남" },
  { id: 4, name: "disgusted", label: "역겨움" },
  { id: 5, name: "relaxed", label: "여유" },
  { id: 6, name: "bored", label: "지루함" },
  { id: 7, name: "loving", label: "사랑" },
  { id: 8, name: "kind", label: "친절" },
  { id: 9, name: "ambitious", label: "야망" },
  { id: 10, name: "supersad", label: "우울" },
  { id: 11, name: "bad", label: "나쁨" },
  { id: 12, name: "sick", label: "아픔" },
];

interface EmotionDrawerProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSelectEmotion: (emotionName: string) => void;
  selectedEmotion: string | null;
}

const EmotionDrawer = ({
  isOpen,
  onOpenChange,
  onSelectEmotion,
  selectedEmotion,
}: EmotionDrawerProps) => {
  // 감정 선택 핸들러
  const handleSelectEmotion = (emotionName: string) => {
    onSelectEmotion(emotionName);
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
        <div className={"text-lg pt-5 pb-5"}>오늘의 감정을 선택해주세요</div>
        <div className={"w-full space-y-4 px-2"}>
          {emotionRows.map((row, rowIndex) => (
            <div key={rowIndex} className={"grid grid-cols-3 gap-4"}>
              {row.map((emotion) => (
                <div
                  key={emotion.id}
                  className={"flex flex-col items-center gap-2"}
                  onClick={() => handleSelectEmotion(emotion.name)}
                >
                  <div
                    className={`size-fit rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      selectedEmotion === emotion.name
                        ? "bg-emerald-100 ring-2 ring-emerald-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={getEmotionImagePath(emotion.name)}
                      alt={emotion.label}
                      className={"w-12 h-12 object-contain"}
                    />
                  </div>
                  <span className={"text-sm text-gray-700"}>
                    {emotion.label}
                  </span>
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
