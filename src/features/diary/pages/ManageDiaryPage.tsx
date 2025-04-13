import Button from "@/components/base/Button";
import Card from "@/components/base/Card";
import Input from "@/components/base/Input";
import Page from "@/components/page/Page";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ManageDiaryPage = () => {
  const navigate = useNavigate();

  // 더미 데이터 - 실제로는 API에서 가져올 데이터
  const [diaryData, setDiaryData] = useState({
    id: "1", // 예시 ID
    title: "AO JS 스터디", // 기존 제목
    coverColor: "#4ade80", // 기존 표지 색상 (초록색)
  });

  const [isFormValid, setIsFormValid] = useState(true);

  // 표지 색상 옵션
  const coverColors = [
    { name: "초록색", value: "#4ade80" },
    { name: "파란색", value: "#3b82f6" },
    { name: "빨간색", value: "#ef4444" },
    { name: "보라색", value: "#8b5cf6" },
    { name: "노란색", value: "#facc15" },
    { name: "주황색", value: "#fb923c" },
  ];

  // 입력값 변경 핸들러
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiaryData({
      ...diaryData,
      title: e.target.value,
    });
  };

  // 색상 변경 핸들러
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

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div>일기장 제목</div>
        <Button variant={"text"} size={"sm"}>
          완료
        </Button>
      </Page.Header>
      <Page.Content className={"px-6 py-4"}>
        <h1 className={"text-xl font-medium my-3"}>일기장 관리</h1>

        {/* 일기장 제목 수정 카드 */}
        <Card className={"mb-6"}>
          <h2 className={"text-lg font-medium mb-4"}>일기장 제목</h2>
          <Input
            className={"w-full"}
            placeholder={"일기장 제목을 입력하세요"}
            value={diaryData.title}
            onChange={handleTitleChange}
          />
          {!isFormValid && diaryData.title.trim().length === 0 && (
            <p className={"mt-1 text-xs text-red-500"}>
              일기장 제목을 입력해주세요.
            </p>
          )}
        </Card>

        {/* 일기장 표지 색상 선택 카드 */}
        <Card className={"mb-8"}>
          <h2 className={"text-lg font-medium mb-4"}>표지 색상</h2>
          <div className={"grid grid-cols-3 gap-4"}>
            {coverColors.map((color) => (
              <div
                key={color.value}
                className={"flex flex-col items-center"}
                onClick={() => handleColorChange(color.value)}
              >
                <div
                  className={
                    "w-16 h-24 rounded-r-md shadow-md mb-2 cursor-pointer flex relative"
                  }
                  style={{
                    borderLeft: `5px solid ${color.value}`,
                    borderColor: color.value,
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
        </Card>

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
          className={"w-full"}
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
