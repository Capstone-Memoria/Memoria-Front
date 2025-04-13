import Page from "@/components/page/Page";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";

import { useNavigate } from "react-router-dom";

const ViewDiaryPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false); // diary의 즐겨찾기 상태

  const menuItems = [
    {
      label: "일기장 관리",
      onClick: () => navigate("/diary/1/manage"),
    },
    {
      label: "일기장 멤버 관리",
      onClick: () => navigate("/diary/1/members"),
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
        <div>일기장 제목</div>
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
                        "text-center text-base font-normal hover:bg-gray-100 w-full px-4 py-4 border-b border-gray-400"
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
