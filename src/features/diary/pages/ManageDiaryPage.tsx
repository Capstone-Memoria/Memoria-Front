import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DiaryCoverCarousel from "@/components/diary/DiaryCoverCarousel";
import Page from "@/components/page/Page";
import { useEffect, useState } from "react";
import {
  MdOutlineKeyboardBackspace,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ManageDiaryPage = () => {
  const navigate = useNavigate();

  // 더미 데이터 - 실제로는 API에서 받아올 데이터
  const [diaryData, setDiaryData] = useState({
    id: "1", // 예시 ID
    title: "AO JS 스터디", // 기존 제목
    coverColor: "#4ade80", // 기존 표지 색상 (초록색)
  });

  const [isFormValid, setIsFormValid] = useState(true);

  // "title" 또는 "cover" 편집 섹션이 열리도록 관리
  const [openSection, setOpenSection] = useState<"title" | "cover" | null>(
    null
  );

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // 입력값 변경 핸들러 (일기장 제목)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiaryData({
      ...diaryData,
      title: e.target.value,
    });
    // 제목 편집 폼은 이미 열려 있으므로 따로 openSection 처리하지 않아도 됨
  };

  // 폼 유효성 검사
  useEffect(() => {
    setIsFormValid(diaryData.title.trim().length > 0);
  }, [diaryData.title]);

  // 삭제 핸들러
  const handleDelete = () => {
    // API 호출 로직이 여기에 들어갈 예정
    console.log("일기장 삭제:", diaryData.id);
    // 성공 후 이전 페이지로 이동
    navigate(-1);
  };

  // 저장 핸들러
  const handleSave = () => {
    if (!isFormValid) return;
    // API 호출 로직이 여기에 들어갈 예정
    console.log("일기장 정보 수정:", diaryData);
    // 성공 후 이전 페이지로 이동
    navigate(-1);
  };

  const handleTitleSubmit = () => {
    // 제목 저장 로직
    if (!isFormValid) return;
    setOpenSection(null);
  };

  const handlePresetSelect = (index: number) => {
    setSelectedPresetIndex(index);
  };

  const handleCoverSubmit = () => {
    // 표지 색상 저장 로직
    setDiaryData((prev) => ({
      ...prev,
    }));
    setOpenSection(null);
  };

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div>일기장 관리</div>
        <Button variant={"text"} size={"sm"} onClick={handleSave}>
          완료
        </Button>
      </Page.Header>
      <Page.Content className={"px-6 py-4"}>
        <h2 className={"text-black text-lg font-semibold pt-5"}>일기장 관리</h2>

        {/* 일기장 제목 수정 섹션 */}
        <div className={"flex flex-col gap-3"}>
          <div
            className={
              "flex justify-between items-center border-b border-gray-400 pb-5"
            }
          >
            <div className={"text-base"}>일기장 제목</div>
            <div className={"flex items-center gap-2"}>
              <div className={"text-gray-5"}>{diaryData.title}</div>
              <MdOutlineModeEditOutline
                className={"cursor-pointer"}
                onClick={() =>
                  setOpenSection((prev) => (prev === "title" ? null : "title"))
                }
              />
            </div>
          </div>
          {/* 편집 폼: 슬라이드 애니메이션 효과 적용 */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              openSection === "title"
                ? "max-h-40 opacity-100 mt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <Input
              className={"w-full text-sm"}
              variant={"white"}
              placeholder={"일기장 제목을 입력하세요"}
              label={"일기장 제목을 입력해주세요."}
              labelClassName={"text-black mb-2 text-sm"}
              value={diaryData.title}
              onChange={handleTitleChange}
            />
            {/* error message */}
            {!isFormValid && (
              <div className={"text-red-500 text-xs mt-1"}>
                제목을 입력해주세요.
              </div>
            )}
            {/* 저장 및 취소 버튼 */}
            {/* input에 아무것도 입력 안하면 저장 안되게 */}
            <div className={"flex justify-end gap-2 my-3"}>
              <Button
                onClick={() => {
                  setOpenSection(null);
                }}
                className={"px-3 rounded-md bg-gray-200 text-black"}
                size={"sm"}
              >
                취소
              </Button>
              <Button
                onClick={handleTitleSubmit}
                className={"px-3 rounded-md"}
                size={"sm"}
              >
                저장
              </Button>
            </div>
          </div>
          <div
            className={
              "flex justify-between items-center border-b border-gray-400 pb-5"
            }
          >
            <div
              className={"text-base"}
              onClick={() =>
                setOpenSection((prev) => (prev === "cover" ? null : "cover"))
              }
            >
              일기장 표지 수정
            </div>
          </div>
          {/* 편집 중일 때: 색상 선택 그리드 (슬라이드 애니메이션 적용) */}
        </div>
      </Page.Content>
      <div className={"pb-20"}>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            openSection === "cover"
              ? "max-h-fit opacity-100 mt-4 mb-20"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className={"mt-2 px-6"}>
            <p className={"text-sm font-normal"}>
              일기장 커버 스타일을 다시 선택해주세요.
            </p>
            <DiaryCoverCarousel
              className={"w-fit h-full py-8"}
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
          <div className={"flex justify-center gap-2 my-6"}>
            <Button
              onClick={() => {
                setOpenSection(null);
              }}
              className={"px-3 rounded-md bg-gray-200 text-black"}
              size={"sm"}
            >
              취소
            </Button>
            <Button
              onClick={handleCoverSubmit}
              className={"px-3 rounded-md"}
              size={"sm"}
            >
              저장
            </Button>
          </div>
        </div>
        <div className={"flex justify-between items-center pt-3 px-6"}>
          <Button
            variant={"text"}
            onClick={handleDelete}
            disabled={!isFormValid}
            className={"p-0 text-sm text-gray-400 border-b border-b-gray-400"}
          >
            일기장 삭제하기
          </Button>
        </div>
      </div>
    </Page.Container>
  );
};

export default ManageDiaryPage;
