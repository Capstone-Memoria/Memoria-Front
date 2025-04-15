import api from "@/api";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

const ViewDiaryPage = () => {
  /* Properties */
  const navigate = useNavigate();
  const { diaryId } = useParams();

  /* States */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false); // diary의 즐겨찾기 상태

  /* Server Side */
  const { data, isLoading } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryId],
    queryFn: () => api.diary.fetchDiaryBookById(Number(diaryId)),
  });

  /* UI */
  const menuItems = [
    {
      label: "일기장 관리",
      onClick: () => navigate(`/diary/${diaryId}/manage`),
    },
    {
      label: "일기장 멤버 관리",
      onClick: () => navigate(`/diary/${diaryId}/members`),
    },
    {
      label: isPinned ? "즐겨찾기 해제" : "즐겨찾기 추가",
      onClick: () => setIsPinned(!isPinned),
    },
  ];

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl pr-8"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div>
          {isLoading ? (
            <div className={"h-5 w-16 bg-gray-200 animate-pulse"} />
          ) : (
            <>{data?.title}</>
          )}
        </div>
        <div className={"flex"}>
          <div className={"p-2 flex items-center justify-center"}>
            <IoCalendarOutline className={"text-xl"} />
          </div>
          <div className={"py-2 pl-2"}>
            <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DrawerTrigger asChild>
                <RiMore2Fill className={"text-xl"} />
              </DrawerTrigger>
              <DrawerContent className={"pb-8"}>
                <div className={"flex flex-col gap-2 p-4"}>
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick();
                        setIsMenuOpen(false);
                      }}
                      className={
                        "text-center text-base font-normal hover:bg-gray-100 w-full px-4 pt-4 pb-5 border-b border-gray-400"
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div
                  className={
                    "text-sm text-gray-500 px-4 py-2 text-center underline"
                  }
                >
                  다이어리 탈퇴하기
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </Page.Header>
      <Page.Content>PageContent</Page.Content>
      <Page.Footer>Footer</Page.Footer>
    </Page.Container>
  );
};

export default ViewDiaryPage;
