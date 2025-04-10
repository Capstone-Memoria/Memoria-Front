import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DiaryCoverCarousel from "@/components/diary/DiaryCoverCarousel";
import Page from "@/components/page/Page";
import DiaryCreateHeader from "@/features/main/components/DiaryCreateHeader";
import { useEffect, useState } from "react";

const CreateDiaryPage = () => {
  const [diaryTitle, setDiaryTitle] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  useEffect(() => {
    setSuccess(diaryTitle.length > 0);
  }, [diaryTitle]);

  const handlePresetSelect = (index: number) => {
    setSelectedPresetIndex(index);
  };

  return (
    <Page.Container>
      <DiaryCreateHeader success={success} />
      <Page.Content>
        <div className={"mt-4"}>
          <p className={"text-sm font-normal"}>
            새 일기장의 제목을 입력해주세요.
          </p>
          <Input
            className={"w-full mt-2 text-sm"}
            placeholder={"ex) 메모리아 일기장"}
            value={diaryTitle}
            onChange={(e) => setDiaryTitle(e.target.value)}
          />
        </div>
        <div className={"mt-8"}>
          <p className={"text-sm font-normal mb-4"}>
            일기장 커버 스타일을 선택해주세요.
          </p>
          <DiaryCoverCarousel
            className={"w-full py-4"}
            onSelect={handlePresetSelect}
          />
        </div>
        <div className={"flex gap-15 justify-center mt-5"}>
          <Button
            size={"xs"}
            className={"w-28 rounded-sm bg-gray-200"}
            variant={"secondary"}
          >
            AI로 배경사진 만들기
          </Button>
          <Button
            size={"xs"}
            className={"w-28 rounded-sm bg-gray-200"}
            variant={"secondary"}
          >
            사진 업로드
          </Button>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default CreateDiaryPage;
