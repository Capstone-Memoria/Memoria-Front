import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DiaryCover from "@/components/diary/DiaryCover";
import Page from "@/components/page/Page";
import DiaryCreateHeader from "@/features/main/components/DiaryCreateHeader";
import { useEffect, useState } from "react";

const CreateDiaryPage = () => {
  const [diaryTitle, setDiaryTitle] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuccess(diaryTitle.length > 0);
  }, [diaryTitle]);

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
        <div className={"pt-10 flex justify-center items-center"}>
          <DiaryCover showPin={false} className={"w-52 h-83"} />
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
