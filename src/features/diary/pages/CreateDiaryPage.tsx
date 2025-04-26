import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DiaryCoverCarousel from "@/components/diary/DiaryCoverCarousel";
import Page from "@/components/page/Page";
import DiaryCreateHeader from "@/features/main/components/DiaryCreateHeader";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaMagic } from "react-icons/fa";
import { MdUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CreateCoverImageDrawer } from "../components/CreateCoverImageDrawer";

const CreateDiaryPage = () => {
  const navigate = useNavigate();
  const [diaryTitle, setDiaryTitle] = useState("");
  const [submit, setSubmit] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [createCoverDrawerOpen, setCreateCoverDrawerOpen] = useState(false);

  useEffect(() => {
    setSubmit(diaryTitle.length > 0);
  }, [diaryTitle]);

  const handlePresetSelect = (index: number) => {
    setSelectedPresetIndex(index);
  };

  /* Server Side */
  const {
    mutate: tryCreateDiaryBook,
    isPending,
    error,
  } = useMutation({
    mutationFn: () => api.diary.createDiaryBook({ title: diaryTitle }),
    onSuccess: (data) => {
      console.log("Diary created successfully", data);
      navigate("/main");
    },
  });

  /* Handlers */
  const handleSubmit = () => {
    if (diaryTitle.length > 0) {
      tryCreateDiaryBook();
    }
  };

  return (
    <Page.Container>
      <DiaryCreateHeader
        isSubmitable={submit}
        onSubmit={handleSubmit}
        isCreating={isPending}
      />
      <Page.Content className={"overflow-x-hidden pb-20"}>
        <div className={"mt-4"}>
          <p className={"text-base font-normal"}>
            새 일기장의 제목을 입력해주세요.
          </p>
          <Input
            className={"w-full mt-2 text-base"}
            placeholder={"ex) 메모리아 일기장"}
            value={diaryTitle}
            onChange={(e) => setDiaryTitle(e.target.value)}
          />
        </div>
        <div className={"mt-8"}>
          <p className={"text-base font-normal mb-4"}>
            일기장 커버 스타일을 선택해주세요.
          </p>
          <DiaryCoverCarousel
            className={"w-fit py-8"}
            onSelect={handlePresetSelect}
          />
        </div>
        <div className={"grid grid-cols-2 justify-items-center mt-5"}>
          <CreateCoverImageDrawer
            open={createCoverDrawerOpen}
            onOpenChange={setCreateCoverDrawerOpen}
          >
            <Button
              className={
                "w-42 flex items-center justify-center gap-4 text-sm rounded-sm bg-gray-200"
              }
              variant={"secondary"}
            >
              <FaMagic />
              AI로 커버 만들기
            </Button>
          </CreateCoverImageDrawer>
          <Button
            size={"sm"}
            className={
              "w-42 flex items-center justify-center gap-4 text-sm rounded-sm bg-gray-200"
            }
            variant={"secondary"}
          >
            <MdUpload className={"text-base"} />
            사진 업로드
          </Button>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default CreateDiaryPage;
