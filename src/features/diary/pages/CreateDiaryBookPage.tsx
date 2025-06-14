import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Page from "@/components/page/Page";
import DiaryCreateHeader from "@/features/main/components/DiaryCreateHeader";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaMagic } from "react-icons/fa";
import { MdUpload } from "react-icons/md";
import { TbSticker2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { CreateCoverImageDrawer } from "../components/CreateCoverImageDrawer";

import CoverExampleImg1 from "@/assets/images/coverimage1.png";
import CoverExampleImg2 from "@/assets/images/coverimage2.png";
import CoverExampleImg3 from "@/assets/images/coverimage3.png";
import CoverExampleImg4 from "@/assets/images/coverimage4.png";
import CoverExampleImg5 from "@/assets/images/coverimage5.png";
import CoverExampleImg6 from "@/assets/images/coverimage6.png";
import ColorPicker from "@/components/base/ColorPicker";
import { DiaryCoverItem } from "@/components/diary/DiaryCover";
import DiaryCoverCarousel from "@/components/diary/DiaryCoverCarousel";

import { BorderBeam } from "@/components/magicui/border-beam";
import { ModifyingSticker } from "@/models/Sticker";
import DiaryDecorateDialog from "../components/stickers/DiaryDecorateDialog";

const DIARY_COVER_PRESETS: DiaryCoverItem[] = [
  {
    type: "preset",
    imageSrc: CoverExampleImg1,
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg2,
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg3,
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg4,
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg5,
  },
  {
    type: "preset",
    imageSrc: CoverExampleImg6,
  },
];

const CreateDiaryPage = () => {
  const navigate = useNavigate();
  const [diaryTitle, setDiaryTitle] = useState("");
  const [selectedSpineColor, setSelectedSpineColor] = useState<string>();
  const [canSubmit, setCanSubmit] = useState(false);
  const [createCoverDrawerOpen, setCreateCoverDrawerOpen] = useState(false);
  const [decorateDialogOpen, setDecorateDialogOpen] = useState(false);
  const [selectedCover, setSelectedCover] = useState<DiaryCoverItem | null>(
    DIARY_COVER_PRESETS[0]
  );
  const [titleError, setTitleError] = useState<string | null>(null);
  const [spineColorError, setSpineColorError] = useState<string | null>(null);

  const [diaryCoverItems, setDiaryCoverItems] =
    useState<DiaryCoverItem[]>(DIARY_COVER_PRESETS);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSpineColorPickerEnabled, setIsSpineColorPickerEnabled] =
    useState(false);
  const [isCoverCarouselEnabled, setIsCoverCarouselEnabled] = useState(false);

  // Base64 문자열을 File 객체로 변환하는 함수
  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error("Invalid base64 string");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    setCanSubmit(diaryTitle.length > 0);
    setIsSpineColorPickerEnabled(diaryTitle.length > 0);

    // 제목이 입력되면 에러 메시지 제거
    if (diaryTitle.length > 0) {
      setTitleError(null);
    }
  }, [diaryTitle]);

  useEffect(() => {
    setIsCoverCarouselEnabled(diaryTitle.length > 0 && !!selectedSpineColor);

    // 책등 색상이 선택되면 에러 메시지 제거
    if (selectedSpineColor) {
      setSpineColorError(null);
    }
  }, [diaryTitle, selectedSpineColor]);

  // --- 파일 업로드 핸들러 ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!fileInputRef.current) return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newCoverItems: DiaryCoverItem[] = Array.from(files).map((file) => ({
      type: "file",
      image: file,
      coverColor: "bg-gray-500", // 기본 색상 설정
    }));

    setDiaryCoverItems((prevItems) => [...newCoverItems, ...prevItems]);

    fileInputRef.current.value = "";
  };

  const handleUploadButtonClick = () => fileInputRef.current?.click();

  // CreateCoverImageDrawer에서 이미지가 확정되었을 때 호출될 함수
  const handleAICoverImageCreated = (imageBase64: string) => {
    const filename = `ai-cover-${Date.now()}.png`; // 파일명 생성
    try {
      const mimeType = "image/png";
      const imageBase64WithSchema = `data:${mimeType};base64,${imageBase64}`;
      const imageFile = base64ToFile(imageBase64WithSchema, filename);
      const newCoverItem: DiaryCoverItem = {
        type: "file",
        image: imageFile,
      };

      setDiaryCoverItems((prevItems) => [newCoverItem, ...prevItems]);
      setCreateCoverDrawerOpen(false); // 드로어를 닫습니다.
    } catch (error) {
      console.error("AI 이미지 변환 중 오류 발생:", error);
      alert("AI 이미지 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 스티커와 함께 다이어리북 생성하는 뮤테이션
  const { mutate: tryCreateDiaryBookWithStickers, error: errorWithStickers } =
    useMutation({
      mutationFn: async (stickers: ModifyingSticker[]) => {
        if (!selectedCover) throw new Error("커버 이미지를 선택해주세요.");
        if (!diaryTitle) throw new Error("일기장 제목을 입력해주세요.");
        if (!selectedSpineColor) throw new Error("책등 색상을 선택해주세요.");

        const coverImageFile = await getCoverImageFile(selectedCover);

        return api.diaryBook.createDiaryBookWithStickers({
          title: diaryTitle,
          coverImage: coverImageFile,
          stickers: stickers,
          spineColor: selectedSpineColor,
        });
      },
      onSuccess: () => navigate("/main"),
      onError: (err) => {
        alert(
          `일기장 생성 실패: ${err instanceof Error ? err.message : "서버 오류"}`
        );
      },
    });

  // DiaryDecorateDialog에서 저장 버튼 클릭 시 호출될 함수
  const handleSaveWithStickers = async (stickers: ModifyingSticker[]) => {
    tryCreateDiaryBookWithStickers(stickers);
  };

  // 유효성 검사 함수
  const validateForm = () => {
    let isValid = true;

    if (!diaryTitle.trim()) {
      setTitleError("일기장 제목을 입력해주세요.");
      isValid = false;
    }

    if (!selectedSpineColor) {
      setSpineColorError("책등 색상을 선택해주세요.");
      isValid = false;
    }

    return isValid;
  };

  return (
    <Page.Container className={"flex flex-col h-full"}>
      <DiaryCreateHeader
        isSubmitable={canSubmit}
        onSubmit={() => {
          if (canSubmit) {
            setDecorateDialogOpen(true);
          } else {
            validateForm();
          }
        }}
        isCreating={false}
      />
      <Page.Content className={"overflow-x-hidden  flex flex-col flex-1 "}>
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
          {titleError && (
            <p className={"text-red-500 text-sm mt-1"}>{titleError}</p>
          )}
        </div>
        <p className={"mt-6"}>일기장 책등 색상을 선택해주세요</p>
        <div className={`mt-6 transition-opacity duration-300`}>
          <ColorPicker
            className={"place-items-center gap-y-6"}
            selectedColor={selectedSpineColor}
            onColorSelect={setSelectedSpineColor}
          />
          {spineColorError && (
            <p className={"text-red-500 text-sm mt-4 text-left"}>
              {spineColorError}
            </p>
          )}
        </div>
        <p className={"mt-6"}>일기장 커버 이미지를 선택해주세요</p>
        <div
          className={`mt-4 flex-1 flex flex-col items-center justify-center transition-opacity duration-300
          `}
        >
          <div>
            <DiaryCoverCarousel
              coverWidth={240}
              className={"w-fit py-8"}
              items={diaryCoverItems}
              onSelectChange={setSelectedCover}
              spineColor={selectedSpineColor}
            />
          </div>
        </div>
        <div className={"w-full px-4"}>
          <div className={"flex justify-between gap-4 items-center mt-5"}>
            <CreateCoverImageDrawer
              open={createCoverDrawerOpen}
              onOpenChange={setCreateCoverDrawerOpen}
              onImageCreate={handleAICoverImageCreated} // AI 이미지 생성 및 확정 시 호출될 콜백 전달
            >
              <div
                className={
                  "w-full flex items-center justify-center gap-4 text-sm relative bg-white border rounded-md py-2 shadow"
                }
              >
                <BorderBeam
                  duration={6}
                  size={40}
                  className={"from-transparent via-red-500 to-transparent"}
                />
                <BorderBeam
                  duration={6}
                  delay={3}
                  size={40}
                  className={"from-transparent via-blue-500 to-transparent"}
                />
                <FaMagic /> AI로 만들기
              </div>
            </CreateCoverImageDrawer>
            <div
              className={
                "w-full flex items-center justify-center gap-4 text-sm relative bg-white border rounded-md py-2 shadow"
              }
              onClick={handleUploadButtonClick}
            >
              <MdUpload className={"text-base"} /> 사진 업로드
            </div>
          </div>
          {/* 꾸미기 버튼 추가 */}
          <Button
            className={
              "w-full mt-4 rounded-md flex items-center justify-center gap-3"
            }
            onClick={() => {
              if (!(!selectedCover || !diaryTitle || !selectedSpineColor)) {
                setDecorateDialogOpen(true);
              } else {
                validateForm();
              }
            }}
            variant={"primary"}
            disabled={!selectedCover || !diaryTitle || !selectedSpineColor}
            size={"lg"}
          >
            <TbSticker2 />
            확정하고 스티커 추가하러 가기
          </Button>
        </div>

        {errorWithStickers && (
          <p className={"text-red-500 text-sm mt-4 text-center"}>
            스티커 포함 일기장 생성 오류:{" "}
            {errorWithStickers instanceof Error
              ? errorWithStickers.message
              : "알 수 없는 오류"}
          </p>
        )}

        {/* 일기장 꾸미기 다이얼로그 */}
        <DiaryDecorateDialog
          open={decorateDialogOpen}
          onOpenChange={setDecorateDialogOpen}
          selectedCover={selectedCover}
          onSave={handleSaveWithStickers}
          spineColor={selectedSpineColor}
        />
      </Page.Content>
    </Page.Container>
  );
};

export default CreateDiaryPage;

const getCoverImageFile = async (
  selectedCover: DiaryCoverItem
): Promise<File> => {
  if (selectedCover.type === "file") {
    // 업로드된 이미지인 경우 File 객체 그대로 사용
    return selectedCover.image;
  } else if (selectedCover.type === "preset") {
    // 프리셋 이미지인 경우 URL에서 File 객체로 변환
    try {
      const response = await fetch(selectedCover.imageSrc);
      const blob = await response.blob();
      return new File([blob], `preset-cover-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });
    } catch (error) {
      console.error("프리셋 이미지 변환 중 오류 발생:", error);
      throw new Error("이미지 변환에 실패했습니다. 다시 시도해주세요.");
    }
  } else {
    throw new Error("지원되지 않는 커버 이미지 타입입니다.");
  }
};
