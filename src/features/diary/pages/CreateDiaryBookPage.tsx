import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DiaryCoverCarousel from "@/components/diary/DiaryCoverCarousel";
import Page from "@/components/page/Page";
import DiaryCreateHeader from "@/features/main/components/DiaryCreateHeader";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaMagic } from "react-icons/fa";
import { MdUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CreateCoverImageDrawer } from "../components/CreateCoverImageDrawer";

import CoverExampleImg1 from "@/assets/images/CoverImage1.png";
import CoverExampleImg2 from "@/assets/images/CoverImage2.png";
import CoverExampleImg3 from "@/assets/images/CoverImage3.jpg";
import CoverExampleImg4 from "@/assets/images/CoverImage4.png";
import CoverExampleImg5 from "@/assets/images/CoverImage5.jpg";

async function sourceToFile(
  source: string,
  filename: string,
  mimeType?: string
): Promise<File | null> {
  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }
    const blob = await response.blob();
    const type = mimeType || blob.type || "image/png";
    return new File([blob], filename, { type });
  } catch (error) {
    console.error("Error converting source to File:", error);
    return null;
  }
}

const CreateDiaryPage = () => {
  const navigate = useNavigate();
  const [diaryTitle, setDiaryTitle] = useState("");
  const [submit, setSubmit] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(
    0
  );
  const [createCoverDrawerOpen, setCreateCoverDrawerOpen] = useState(false);
  const [uploadedCoverImageUrl, setUploadedCoverImageUrl] = useState<
    string | null
  >(null);
  const [uploadedCoverFile, setUploadedCoverFile] = useState<File | null>(null);

  const presetImageSources = [
    CoverExampleImg1,
    CoverExampleImg2,
    CoverExampleImg3,
    CoverExampleImg4,
    CoverExampleImg5,
  ];

  const [finalCoverSource, setFinalCoverSource] = useState<File | string>(
    presetImageSources[0]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSubmit(diaryTitle.length > 0);
  }, [diaryTitle]);

  const handlePresetSelect = (index: number | string) => {
    if (index === "uploaded") {
      setSelectedPresetIndex(null);
      if (uploadedCoverFile) {
        setFinalCoverSource(uploadedCoverFile); // 업로드된 File 객체 사용
      }
    } else if (
      typeof index === "number" &&
      index >= 0 &&
      index < presetImageSources.length
    ) {
      setSelectedPresetIndex(index);
      setUploadedCoverFile(null);
      setUploadedCoverImageUrl(null);
      setFinalCoverSource(presetImageSources[index]); // 프리셋 이미지 경로(string) 사용
    } else {
      // 예외 처리 (기본 0번)
      setSelectedPresetIndex(0);
      setFinalCoverSource(presetImageSources[0]);
    }
  };

  // --- 파일 업로드 핸들러 ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }
      setUploadedCoverFile(file); // File 객체 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedCoverImageUrl(reader.result as string);
        setSelectedPresetIndex(null);
        setFinalCoverSource(file); // 업로드된 File 객체 사용
      };
      reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = "";
  };

  const handleUploadButtonClick = () => fileInputRef.current?.click();

  /* Server Side */
  const {
    mutate: tryCreateDiaryBook,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", diaryTitle);

      let coverFile: File | null = null;

      // finalCoverSource를 File 객체로 변환 (필요시)
      if (finalCoverSource instanceof File) {
        coverFile = finalCoverSource;
      } else if (typeof finalCoverSource === "string") {
        const filename = `cover_${selectedPresetIndex ?? "uploaded"}.${finalCoverSource.split(".").pop() || "png"}`;
        coverFile = await sourceToFile(finalCoverSource, filename);
        if (!coverFile)
          throw new Error("선택된 커버 이미지를 처리 중 오류 발생");
      } else {
        throw new Error("커버 이미지가 올바르게 선택되지 않음");
      }

      // 최종 File 객체를 FormData에 추가
      if (coverFile) {
        formData.append("coverImage", coverFile);
      } else {
        throw new Error("커버 이미지를 준비할 수 없음");
      }

      return api.diaryBook.createDiaryBook(formData);
    },
    onSuccess: () => navigate("/main"),
    onError: (err) =>
      alert(
        `일기장 생성 실패: ${err instanceof Error ? err.message : "서버 오류"}`
      ),
  });

  const handleSubmit = () => {
    if (diaryTitle.length > 0) tryCreateDiaryBook();
    else alert("일기장 제목을 입력해주세요.");
  };

  return (
    <Page.Container>
      <DiaryCreateHeader
        isSubmitable={submit}
        onSubmit={handleSubmit}
        isCreating={isPending}
      />
      <Page.Content className={"overflow-x-hidden pb-20"}>
        <input
          type={"file"}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={"image/*"}
          style={{ display: "none" }}
        />
        <div className={"mt-4"}>
          <p>새 일기장의 제목을 입력해주세요.</p>
          <Input
            className={"w-full mt-2"}
            placeholder={"ex) 메모리아 일기장"}
            value={diaryTitle}
            onChange={(e) => setDiaryTitle(e.target.value)}
          />
        </div>
        <div className={"mt-8"}>
          <p>일기장 커버를 자유롭게 꾸며보세요!</p>
          <DiaryCoverCarousel
            className={"w-fit py-8"}
            uploadedCoverUrl={uploadedCoverImageUrl}
            onSelect={handlePresetSelect}
          />
        </div>
        <div className={"grid grid-cols-2 justify-items-center mt-5"}>
          <CreateCoverImageDrawer
            open={createCoverDrawerOpen}
            onOpenChange={setCreateCoverDrawerOpen}
          >
            <Button
              variant={"secondary"}
              className={
                "w-42 flex items-center justify-center gap-4 text-sm rounded-sm bg-gray-200"
              }
            >
              <FaMagic /> AI로 커버 만들기
            </Button>
          </CreateCoverImageDrawer>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={handleUploadButtonClick}
            className={
              "w-42 flex items-center justify-center gap-4 text-sm rounded-sm bg-gray-200"
            }
          >
            <MdUpload className={"text-base"} /> 사진 업로드
          </Button>
        </div>
        {error && (
          <p className={"text-red-500 text-sm mt-4 text-center"}>
            오류: {error instanceof Error ? error.message : "알 수 없는 오류"}
          </p>
        )}
      </Page.Content>
    </Page.Container>
  );
};

export default CreateDiaryPage;
