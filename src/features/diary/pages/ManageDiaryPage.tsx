import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
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

  // 표지 색상 옵션
  const coverColors = [
    { name: "초록색", value: "#4ade80" },
    { name: "파란색", value: "#3b82f6" },
    { name: "빨간색", value: "#ef4444" },
    { name: "보라색", value: "#8b5cf6" },
    { name: "노란색", value: "#facc15" },
    { name: "주황색", value: "#fb923c" },
  ];

  // 입력값 변경 핸들러 (일기장 제목)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiaryData({
      ...diaryData,
      title: e.target.value,
    });
    // 제목 편집 폼은 이미 열려 있으므로 따로 openSection 처리하지 않아도 됨
  };

  // 색상 변경 핸들러 (표지 색상)
  const handleColorChange = (color: string) => {
    setDiaryData({
      ...diaryData,
      coverColor: color,
    });
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
        <div className={""}>
          <div
            className={
              "flex justify-between items-center border-b border-gray-400 pb-4"
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
            <div className={"flex justify-end gap-2 mt-3"}>
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
        </div>

        {/* 일기장 표지 색상 선택 섹션 */}
        <div className={"mb-8"}>
          <div
            className={
              "flex justify-between items-center border-b border-gray-400 pb-4"
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
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              openSection === "cover"
                ? "max-h-96 opacity-100 mt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className={"grid grid-cols-3 gap-4"}>
              {coverColors.map((color) => (
                <div
                  key={color.value}
                  className={"flex flex-col items-center cursor-pointer"}
                  onClick={() => handleColorChange(color.value)}
                >
                  <div
                    className={
                      "w-16 h-24 rounded-r-md shadow-md mb-2 flex relative"
                    }
                    style={{
                      borderLeft: `5px solid ${color.value}`,
                      boxShadow:
                        diaryData.coverColor === color.value
                          ? "0 0 0 2px black"
                          : "none",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    <div
                      className={"w-1.5 h-full rounded-l-xs"}
                      style={{ backgroundColor: color.value }}
                    ></div>
                  </div>
                  <span className={"text-xs"}>{color.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 편집이 아닐 때: 현재 표지 색상 미리보기 */}
          {openSection !== "cover" && (
            <div className={"mt-4 flex items-center gap-4"}>
              <div
                className={"w-16 h-24 rounded-r-md shadow-md flex relative"}
                style={{
                  borderLeft: `5px solid ${diaryData.coverColor}`,
                  backgroundColor: "#f3f4f6",
                }}
              >
                <div
                  className={"w-1.5 h-full rounded-l-xs"}
                  style={{ backgroundColor: diaryData.coverColor }}
                ></div>
              </div>
              <span className={"text-base font-medium"}>
                {
                  coverColors.find((c) => c.value === diaryData.coverColor)
                    ?.name
                }
              </span>
            </div>
          )}
        </div>

        <Button
          size={"xl"}
          className={"w-full bg-green-300 text-black"}
          onClick={handleDelete}
          disabled={!isFormValid}
        >
          일기장 삭제하기
        </Button>

        {/* 저장 버튼 */}
        <Button
          size={"xl"}
          className={"w-full mt-4"}
          onClick={handleSave}
          disabled={!isFormValid}
        >
          변경사항 저장
        </Button>
      </Page.Content>
    </Page.Container>
  );
};

export default ManageDiaryPage;
