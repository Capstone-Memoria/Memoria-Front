import Input from "@/components/base/Input";
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
          <p className={"text-sm font-medium"}>
            새 일기장의 제목을 입력해주세요.
          </p>
          <Input
            className={"w-full mt-2 text-sm"}
            placeholder={"ex) 메모리아 일기장"}
            value={diaryTitle}
            onChange={(e) => setDiaryTitle(e.target.value)}
          />
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default CreateDiaryPage;
