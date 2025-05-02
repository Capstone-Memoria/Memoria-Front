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

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSubmit(diaryTitle.length > 0);
  }, [diaryTitle]);

  const handlePresetSelect = (index: number | string) => {
    // 캐러셀에서 업로드된 이미지를 선택했을 때 'uploaded' 문자열을 반환
    if (index === "uploaded") {
      setSelectedPresetIndex(null); // 프리셋 선택 해제 (업로드된 이미지가 선택됨)
      console.log("Uploaded cover selected");
    } else if (typeof index === "number") {
      setSelectedPresetIndex(index);
      setUploadedCoverFile(null); // 프리셋 선택 시 업로드된 파일 초기화
      console.log("Preset cover selected:", index);
    }
  };

  // 파일 선택 처리 핸들러
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      // 파일 타입 검사 (예: 이미지 파일만 허용)
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      setUploadedCoverFile(file); // 파일 객체 저장 (나중에 서버 전송용)

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedCoverImageUrl(reader.result as string);
        // 업로드된 이미지를 기본 선택으로 설정
        setSelectedPresetIndex(null); // 프리셋 선택 해제
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click(); // 숨겨진 파일 입력 클릭 트리거
  };

  /* Server Side */
  const {
    mutate: tryCreateDiaryBook,
    isPending,
    error,
  } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("title", diaryTitle);

      // 선택된 커버 유형에 따라 데이터 추가
      if (uploadedCoverFile && selectedPresetIndex === null) {
        // 업로드된 이미지가 선택되었을 경우
        formData.append("coverImage", uploadedCoverFile);
        formData.append("coverType", "uploaded");
      } else if (selectedPresetIndex !== null) {
        // 프리셋 커버가 선택되었을 경우
        formData.append("presetIndex", selectedPresetIndex.toString());
        formData.append("coverType", "preset");
      } else {
        // 아무것도 선택되지 않은 경우 (기본값 또는 에러 처리)
        console.warn("No cover selected");
        // 기본 프리셋 0번을 사용
        formData.append("presetIndex", "0");
        formData.append("coverType", "preset");
      }

      // API 함수 호출 (FormData 객체 전달)
      return api.diaryBook.createDiaryBook(formData);
    },
    onSuccess: (data) => {
      console.log("Diary created successfully", data);
      navigate("/main");
    },
    onError: (err) => {
      console.error("Failed to create diary:", err);
      // 사용자에게 에러 알림 표시
      alert(`일기장 생성에 실패했습니다: ${err.message || "서버 오류"}`);
    },
  });

  /* Handlers */
  const handleSubmit = () => {
    if (diaryTitle.length > 0) {
      tryCreateDiaryBook();
    } else {
      alert("일기장 제목을 입력해주세요.");
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
        {/* 숨겨진 파일 입력 요소 */}
        <input
          type={"file"}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={"image/*"} // 이미지 파일만 받도록 설정
          style={{ display: "none" }} // 화면에 보이지 않도록 숨김
        />

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
            일기장 커버를 자유롭게 꾸며보세요!
          </p>
          {/* DiaryCoverCarousel에 업로드된 이미지 URL 전달 */}
          <DiaryCoverCarousel
            className={"w-fit py-8"}
            onSelect={handlePresetSelect}
            uploadedCoverUrl={uploadedCoverImageUrl} // 업로드된 이미지 URL 전달
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

          {/* 사진 업로드 버튼에 onClick 핸들러 연결 */}
          <Button
            size={"sm"}
            className={
              "w-42 flex items-center justify-center gap-4 text-sm rounded-sm bg-gray-200"
            }
            variant={"secondary"}
            onClick={handleUploadButtonClick}
          >
            <MdUpload className={"text-base"} />
            사진 업로드
          </Button>
        </div>
        {/* 에러 메시지 표시 (선택적) */}
        {error && (
          <p className={"text-red-500 text-sm mt-4 text-center"}>
            일기장 생성 중 오류 발생: {error.message || "알 수 없는 오류"}
          </p>
        )}
      </Page.Content>
    </Page.Container>
  );
};

export default CreateDiaryPage;
