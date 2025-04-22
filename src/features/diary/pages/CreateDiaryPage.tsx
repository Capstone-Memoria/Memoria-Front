import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DiaryCoverCarousel from "@/components/diary/DiaryCoverCarousel";
import Page from "@/components/page/Page";
import DiaryCreateHeader from "@/features/main/components/DiaryCreateHeader";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateDiaryPage = () => {
  const navigate = useNavigate();
  const [diaryTitle, setDiaryTitle] = useState("");
  const [submit, setSubmit] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

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
    mutationFn: () => {
      const formData = new FormData();

      // 제목 추가 (백엔드에서 받을 key 이름 확인 필요, 예: 'title')
      formData.append("title", diaryTitle);

      // TODO: 추후 선택된 프리셋 인덱스나 커버 이미지 파일 추가
      // formData.append('presetIndex', selectedPresetIndex.toString());
      // if (coverImageFile) {
      //   formData.append('coverImage', coverImageFile); // 백엔드에서 받을 파일 key 이름 확인 필요
      // }

      // 수정된 API 함수 호출 (FormData 객체 전달)
      return api.diary.createDiaryBook(formData);
    },
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
        <div className={"flex gap-8 justify-center mt-5"}>
          <Button
            size={"sm"}
            className={"w-36 rounded-sm bg-gray-200"}
            variant={"secondary"}
          >
            AI로 배경사진 만들기
          </Button>
          <Button
            size={"sm"}
            className={"w-36 rounded-sm bg-gray-200"}
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
