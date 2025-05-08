import api from "@/api";
import { StickerItem } from "@/api/diary-book";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DiaryCoverCarousel, {
  DiaryCoverItem,
  PresetDiaryCoverItem,
  UploadedDiaryCoverItem,
} from "@/components/diary/DiaryCoverCarousel";
import Page from "@/components/page/Page";
import DiaryCreateHeader from "@/features/main/components/DiaryCreateHeader";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaMagic } from "react-icons/fa";
import { MdUpload } from "react-icons/md";
import { TbSticker2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { CreateCoverImageDrawer } from "../components/CreateCoverImageDrawer";
import { DiaryDecorateDialog } from "../components/DiaryDecorateDialog";

import CoverExampleImg1 from "@/assets/images/CoverImage1.png";
import CoverExampleImg2 from "@/assets/images/CoverImage2.png";
import CoverExampleImg3 from "@/assets/images/CoverImage3.jpg";
import CoverExampleImg4 from "@/assets/images/CoverImage4.png";
import CoverExampleImg5 from "@/assets/images/CoverImage5.jpg";

const DIARY_COVER_PRESETS: PresetDiaryCoverItem[] = [
  {
    type: "preset",
    imageSrc: CoverExampleImg1,
    coverColor: "bg-red-500",
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg2,
    coverColor: "bg-blue-500",
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg3,
    coverColor: "bg-green-500",
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg4,
    coverColor: "bg-yellow-500",
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg5,
    coverColor: "bg-purple-500",
  },
];

const CreateDiaryPage = () => {
  const navigate = useNavigate();
  const [diaryTitle, setDiaryTitle] = useState("");
  const [submit, setSubmit] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(
    0
  );
  const [createCoverDrawerOpen, setCreateCoverDrawerOpen] = useState(false);
  const [decorateDialogOpen, setDecorateDialogOpen] = useState(false);
  const [selectedCover, setSelectedCover] = useState<DiaryCoverItem | null>(
    DIARY_COVER_PRESETS[0]
  );
  const [stickers, setStickers] = useState<StickerItem[]>([]);

  const [diaryCoverItems, setDiaryCoverItems] =
    useState<DiaryCoverItem[]>(DIARY_COVER_PRESETS);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSubmit(diaryTitle.length > 0);
  }, [diaryTitle]);

  // --- 파일 업로드 핸들러 ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!fileInputRef.current) return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newCoverItems: UploadedDiaryCoverItem[] = Array.from(files).map(
      (file) => ({
        type: "uploaded",
        image: file,
        coverColor: "bg-gray-500", // 기본 색상 설정
      })
    );

    setDiaryCoverItems((prevItems) => [...prevItems, ...newCoverItems]);

    fileInputRef.current.value = "";
  };

  const handleUploadButtonClick = () => fileInputRef.current?.click();

  // 스티커 저장 핸들러
  const handleSaveStickers = (newStickers: StickerItem[]) => {
    setStickers(newStickers);
    console.log("저장된 스티커:", newStickers);
  };

  /* Server Side */
  const {
    mutate: tryCreateDiaryBook,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!selectedCover) throw new Error("커버 이미지를 선택해주세요");

      let coverImageFile: File;

      // 선택된 커버 이미지의 타입에 따라 처리
      if (selectedCover.type === "uploaded") {
        // 업로드된 이미지인 경우 File 객체 그대로 사용
        coverImageFile = (selectedCover as UploadedDiaryCoverItem).image;
      } else if (selectedCover.type === "preset") {
        // 프리셋 이미지인 경우 URL에서 File 객체로 변환
        const presetCover = selectedCover as PresetDiaryCoverItem;
        try {
          const response = await fetch(presetCover.imageSrc);
          const blob = await response.blob();
          coverImageFile = new File([blob], `preset-cover-${Date.now()}.jpg`, {
            type: blob.type || "image/jpeg",
          });
        } catch (error) {
          console.error("프리셋 이미지 변환 중 오류 발생:", error);
          throw new Error("이미지 변환에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        throw new Error("지원되지 않는 커버 이미지 타입입니다.");
      }

      return api.diaryBook.createDiaryBook({
        title: diaryTitle,
        coverImage: coverImageFile,
        stickers: stickers.length > 0 ? stickers : undefined,
      });
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
            items={diaryCoverItems}
            onSelectChange={setSelectedCover}
          />
        </div>
        <div className={"w-full px-4"}>
          <div className={"flex justify-between items-center mt-5"}>
            <CreateCoverImageDrawer
              open={createCoverDrawerOpen}
              onOpenChange={setCreateCoverDrawerOpen}
            >
              <Button
                variant={"secondary"}
                className={
                  "w-36 flex items-center justify-center gap-4 text-sm rounded-sm bg-gray-200"
                }
              >
                <FaMagic /> AI로 만들기
              </Button>
            </CreateCoverImageDrawer>
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={handleUploadButtonClick}
              className={
                "w-36 flex items-center justify-center gap-4 text-sm rounded-sm bg-gray-200"
              }
            >
              <MdUpload className={"text-base"} /> 사진 업로드
            </Button>
          </div>
          {/* 꾸미기 버튼 추가 */}
          {selectedCover && (
            <Button
              className={
                "w-full mt-4 rounded-md flex items-center justify-center gap-3"
              }
              onClick={() => setDecorateDialogOpen(true)}
              variant={"primary"}
            >
              <TbSticker2 />
              스티커로 꾸미기
            </Button>
          )}
        </div>

        {error && (
          <p className={"text-red-500 text-sm mt-4 text-center"}>
            오류: {error instanceof Error ? error.message : "알 수 없는 오류"}
          </p>
        )}

        {/* 일기장 꾸미기 다이얼로그 */}
        <DiaryDecorateDialog
          open={decorateDialogOpen}
          onOpenChange={setDecorateDialogOpen}
          selectedCover={selectedCover}
          onSave={handleSaveStickers}
        />
      </Page.Content>
    </Page.Container>
  );
};

export default CreateDiaryPage;
