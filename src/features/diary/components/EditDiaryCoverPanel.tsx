import Button from "@/components/base/Button";
import ColorPicker from "@/components/base/ColorPicker";
import React, { ChangeEvent, HTMLAttributes, useRef, useState } from "react"; // React 훅 및 이벤트 타입 임포트

// 커버 이미지 예시 임포트
import CoverExampleImg1 from "@/assets/images/coverimage1.png";
import CoverExampleImg2 from "@/assets/images/coverimage2.png";
import CoverExampleImg3 from "@/assets/images/coverimage3.png";
import CoverExampleImg4 from "@/assets/images/coverimage4.png";
import CoverExampleImg5 from "@/assets/images/coverimage5.png";
import CoverExampleImg6 from "@/assets/images/coverimage6.png";
import { DiaryCoverItem } from "@/components/diary/DiaryCover";
import DiaryCoverCarousel from "@/components/diary/DiaryCoverCarousel";
import { FaMagic } from "react-icons/fa";
import { MdUpload } from "react-icons/md";

interface EditDiaryCoverPanelProps extends HTMLAttributes<HTMLDivElement> {
  onCancel?: () => void;
  onSave?: (
    selectedCover: DiaryCoverItem | null,
    spineColor: string | undefined
  ) => void; // spineColor 추가
  isSaving?: boolean;
  initialSpineColor?: string; // 초기 책등 색상 추가
}

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

const EditDiaryCoverPanel: React.FC<EditDiaryCoverPanelProps> = ({
  onCancel,
  onSave,
  isSaving = false,
  initialSpineColor,
  ...props
}) => {
  const [diaryCoverItems, setDiaryCoverItems] =
    useState<DiaryCoverItem[]>(DIARY_COVER_PRESETS);

  const [selectedCover, setSelectedCover] = useState<DiaryCoverItem | null>(
    DIARY_COVER_PRESETS[0]
  );

  const [selectedSpineColor, setSelectedSpineColor] = useState<
    string | undefined
  >(initialSpineColor);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!fileInputRef.current) return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newCoverItems: DiaryCoverItem[] = Array.from(files).map((file) => ({
      type: "file",
      image: file,
      coverColor: "bg-gray-500", // 업로드 이미지 기본 색상
    }));

    setDiaryCoverItems((prevItems) => [...prevItems, ...newCoverItems]);

    if (newCoverItems.length > 0) {
      setSelectedCover(newCoverItems[0]);
    }

    fileInputRef.current.value = "";
  };

  const handleUploadButtonClick = () => fileInputRef.current?.click();

  const handleSaveClick = () => {
    onSave?.(selectedCover, selectedSpineColor);
  };

  return (
    <div {...props}>
      <input
        type={"file"}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={"image/*"} // 이미지 파일만 허용
        style={{ display: "none" }}
        multiple // 여러 파일 선택 허용 (원하는 동작에 따라 제거 가능)
      />

      <div className={"mt-2 px-6"}>
        <p className={"text-sm font-normal"}>
          일기장 커버 스타일을 다시 선택해주세요.
        </p>
        {/* 일기장 커버 캐러셀 */}
        <DiaryCoverCarousel
          className={"w-fit py-8"}
          items={diaryCoverItems}
          onSelectChange={setSelectedCover}
          spineColor={selectedSpineColor}
        />

        {/* 책등 색상 선택 */}
        <div className={"mt-6"}>
          <p className={"text-sm font-normal mb-4"}>
            일기장 책등 색상을 선택해주세요.
          </p>
          <ColorPicker
            selectedColor={selectedSpineColor}
            onColorSelect={setSelectedSpineColor}
            className={"justify-center"}
          />
        </div>
      </div>
      <div className={"flex gap-8 justify-center mt-5"}>
        <Button
          size={"sm"}
          className={
            "w-42 flex items-center justify-center gap-2 rounded-sm bg-gray-200 text-black"
          }
          variant={"secondary"}
        >
          <FaMagic /> AI로 배경사진 만들기
        </Button>
        {/* 사진 업로드 버튼 (숨겨진 파일 입력 트리거) */}
        <Button
          size={"sm"}
          className={
            "w-36 flex items-center justify-center gap-2 rounded-sm bg-gray-200 text-black"
          }
          variant={"secondary"}
          onClick={handleUploadButtonClick}
        >
          <MdUpload className={"text-base"} /> 사진 업로드
        </Button>
      </div>
      <div className={"flex justify-center gap-2 my-6"}>
        {/* 취소 버튼 */}
        <Button
          className={"px-3 rounded-md bg-gray-200 text-black"}
          size={"sm"}
          onClick={() => onCancel?.()}
          disabled={isSaving}
        >
          취소
        </Button>
        <Button
          className={"px-3 rounded-md"}
          size={"sm"}
          onClick={handleSaveClick}
          disabled={isSaving}
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
};

export default EditDiaryCoverPanel;
