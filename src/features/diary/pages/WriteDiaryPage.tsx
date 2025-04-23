import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Tiptap from "@/components/editor/Tiptap";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";

const WriteDiaryPage = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const diaryBookId = searchParams.get("diaryBookId");

  // 저장 회색으로 보이다가 제목 입력하면 검정색으로.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState("");

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["fetchMyDiaryBook"],
    queryFn: () =>
      api.diary.fetchMyDiaryBook({
        size: 10,
        page: 1, // TODO: pagination
      }),
  });

  const canSubmit = useMemo(() => {
    return !!diaryTitle && diaryTitle.trim() !== "";
  }, [diaryTitle]);

  useEffect(() => {
    if (diaryBookId === null) {
      setIsMenuOpen(true);
    }
  }, []);

  const selectedDiaryBook = useMemo(() => {
    return data?.content.find((diary) => diary.id === Number(diaryBookId));
  }, [data, diaryBookId]);

  const openDrawer = () => {
    setIsMenuOpen(true);
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
          disabled={!canSubmit}
          size={"sm"}
          className={"text-sm font-normal"}
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
          {isLoading ? (
            <span className={"text-gray-400"}>로딩중...</span>
          ) : (
            selectedDiaryBook?.title || "일기장 선택하기"
          )}
          <IoIosArrowDown />
        </div>
        <div className={"flex flex-col gap-2"}>
          <Input
            className={"w-full text-2xl"}
            placeholder={"일기 제목"}
            onChange={(e) => setDiaryTitle(e.target.value)}
          />
        </div>
        <div className={"flex-1 rounded-lg"}>
          <Tiptap />
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
            <div className={"flex flex-col items-center gap-2"}>
              {isLoading && (
                <div className={"text-gray-400 text-sm"}>로딩중...</div>
              )}
              {data?.content.map((diary) => (
                <button // div 대신 button 사용
                  type={"button"}
                  key={diary.id}
                  className={`w-full text-center py-3 rounded-md ${selectedDiaryBook?.id === diary.id ? "bg-emerald-100 text-black font-medium" : "text-gray-700"}`} // 선택/호버 효과
                  onClick={() => {
                    setSearchParams(
                      { diaryBookId: diary.id.toString() },
                      {
                        replace: true,
                      }
                    );
                    setIsMenuOpen(false);
                  }}
                >
                  {diary.title}
                </button>
              ))}
            </div>
          </div>
          <div
            className={"text-emerald-500 mt-4"}
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
