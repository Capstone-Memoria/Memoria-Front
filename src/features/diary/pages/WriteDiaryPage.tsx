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
import { useNavigate } from "react-router-dom";

const WriteDiaryPage = () => {
  const navigate = useNavigate();
  // 저장 회색으로 보이다가 제목 입력하면 검정색으로.
  const [submit, setSubmit] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [diaryBookTitle, setDiaryBookTitle] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");

  useEffect(() => {
    setSubmit(diaryTitle.length > 0);
  }, [diaryTitle]);

  const { data, isLoading } = useQuery({
    queryKey: ["fetchMyDiaries"],
    queryFn: () =>
      api.diary.fetchMyDiaries({
        size: 10,
        page: 1, // TODO: pagination
      }),
  });

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
          disabled={!submit}
          size={"sm"}
          className={"text-sm font-normal"}
          onClick={() => {
            navigate("/diary");
          }}
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
        <div className={"flex-1 rounded-lg"}>
          <Tiptap />
        </div>
      </Page.Content>
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent
          className={"px-5 pb-12 flex justify-center items-center"}
        >
          <div className={"text-lg pt-5 pb-12"}>일기장을 선택해주세요.</div>
          <div className={"flex flex-col gap-10 items-center"}>
            {isLoading && (
              <div className={"text-gray-400 text-sm"}>로딩중...</div>
            )}
            {data?.content.map((diary) => (
              <div
                key={diary.id}
                className={"flex items-center justify-center"}
              >
                <div
                  className={"text-base"}
                  onClick={() => {
                    setDiaryBookTitle(diary.title);
                    setIsMenuOpen(false);
                  }}
                >
                  {diary.title}
                </div>
              </div>
            ))}
            <div
              className={"text-emerald-500"}
              onClick={() => navigate("/create-diary")}
            >
              + 새 일기장
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Page.Container>
  );
};
export default WriteDiaryPage;
