import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Tiptap from "@/components/editor/Tiptap";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";

const WriteDiaryPage = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const diaryBookId = searchParams.get("diaryBookId");

  // 저장 회색으로 보이다가 제목 입력하면 검정색으로.
  const [submit, setSubmit] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [diaryBookTitle, setDiaryBookTitle] = useState("");
  const [selectedDiaryBookId, setSelectedDiaryBookId] = useState<number | null>(
    null
  );
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");

  useEffect(() => {
    setSubmit(selectedDiaryBookId !== null && diaryTitle.trim().length > 0);
  }, [selectedDiaryBookId, diaryTitle]);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["fetchMyDiaries"],
    queryFn: () =>
      api.diary.fetchMyDiaries({
        size: 10,
        page: 1, // TODO: pagination
      }),
  });

  useEffect(() => {
    // 데이터 로딩이 성공적으로 완료되었을 때만 실행
    if (isSuccess && data?.content) {
      const idFromQuery = searchParams.get("diaryBookId");

      if (idFromQuery) {
        // 쿼리 파라미터 ID가 있는 경우
        const numericId = parseInt(idFromQuery, 10);
        if (!isNaN(numericId)) {
          // 유효한 숫자인지 확인
          const foundDiary = data.content.find(
            (diary) => diary.id === numericId
          );

          if (foundDiary) {
            // 해당 ID의 일기장을 찾음: 선택 상태 업데이트 및 Drawer 닫기
            setSelectedDiaryBookId(foundDiary.id);
            setDiaryBookTitle(foundDiary.title);
            setIsMenuOpen(false); // Drawer 닫기
          } else {
            // 해당 ID의 일기장을 찾지 못함: Drawer 열기
            console.warn(`Diary book with ID ${numericId} not found.`);
            setSelectedDiaryBookId(null); // 선택 초기화
            setDiaryBookTitle("");
            setIsMenuOpen(true); // Drawer 열기
          }
        } else {
          // 쿼리 파라미터 ID가 유효한 숫자가 아님: Drawer 열기
          console.warn(`Invalid diaryBookId in query params: ${idFromQuery}.`);
          setSelectedDiaryBookId(null); // 선택 초기화
          setDiaryBookTitle("");
          setIsMenuOpen(true); // Drawer 열기
        }
      } else {
        // 쿼리 파라미터 ID가 없는 경우: Drawer 열기
        setIsMenuOpen(true);
        setSelectedDiaryBookId(null); // 선택 초기화
        setDiaryBookTitle("");
      }
    }
  }, [isSuccess, data, searchParams]);

  const openDrawer = () => {
    setIsMenuOpen(true);
  };

  const handleComplete = () => {
    if (!selectedDiaryBookId || !diaryTitle.trim()) {
      alert("일기장 선택과 제목 입력은 필수입니다.");
      return;
    }
    console.log("Saving diary:", {
      diaryBookId: selectedDiaryBookId,
      title: diaryTitle,
      content: diaryContent, // Tiptap에서 가져온 HTML 또는 JSON 내용
    });
    // 예시: api.diary.createDiaryEntry({ diaryBookId: selectedDiaryBookId, title: diaryTitle, content: diaryContent })
    //       .then(() => navigate('/diary')); // 저장 후 이동
    alert("일기 저장 로직 필요!"); // 임시 알림
    navigate("/diary/" + selectedDiaryBookId);
  };

  const handleContentChange = (content: string) => {
    setDiaryContent(content);
    // 내용 변경 시에도 완료 버튼 상태 업데이트가 필요하면 useEffect 의존성 배열에 추가
  };

  return (
    <Page.Container className={"h-full flex flex-col"}>
      <Page.Header>
        <div className={"text-2xl pr-4"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div className={"text-lg"}>일기 작성하기</div>
        <Button
          variant={"text"}
          disabled={!submit}
          size={"sm"}
          className={"text-sm font-normal"}
          onClick={handleComplete}
        >
          완료
        </Button>
      </Page.Header>
      <Page.Content className={"flex flex-col gap-6 flex-1"}>
        <div
          className={
            "w-full flex justify-between items-center mt-2 bg-gray-100 rounded-3xl px-4 py-2"
          }
          onClick={openDrawer}
        >
          {diaryBookTitle || "일기장 선택하기"}
          <IoIosArrowDown />
        </div>
        <div className={"flex flex-col gap-2"}>
          <Input
            className={"w-full text-2xl"}
            placeholder={"일기 제목"}
            onChange={(e) => setDiaryTitle(e.target.value)}
          />
        </div>
        <div className={"bg-gray-100 flex-1 rounded-lg p-3"}>
          <Tiptap
            content={diaryContent}
            onChange={handleContentChange}
            placeholder={"오늘 이야기"}
          />
        </div>
      </Page.Content>
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent
          className={"px-5 pb-12 flex justify-center items-center"}
        >
          <div className={"text-lg pt-5 pb-8"}>일기장을 선택해주세요.</div>
          <div
            className={
              "flex-1 w-full overflow-y-auto max-h-[40vh] [&::-webkit-scrollbar]:hidden"
            }
          >
            <div className={"flex flex-col gap-5 items-center"}>
              {isLoading && (
                <div className={"text-gray-400 text-sm"}>로딩중...</div>
              )}
              {data?.content.map((diary) => (
                <button // div 대신 button 사용
                  type={"button"}
                  key={diary.id}
                  className={`w-full text-center py-3 rounded-md ${selectedDiaryBookId === diary.id ? "bg-emerald-100 text-black font-medium" : "text-gray-700"}`} // 선택/호버 효과
                  onClick={() => {
                    setDiaryBookTitle(diary.title);
                    setSelectedDiaryBookId(diary.id); // ID도 저장
                    setIsMenuOpen(false);
                  }}
                >
                  {diary.title}
                </button>
              ))}
            </div>
          </div>
          <div
            className={"text-emerald-500"}
            onClick={() => navigate("/create-diary")}
          >
            + 새 일기장
          </div>
        </DrawerContent>
      </Drawer>
    </Page.Container>
  );
};
export default WriteDiaryPage;
