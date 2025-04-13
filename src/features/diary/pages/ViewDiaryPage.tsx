import Page from "@/components/page/Page";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useNavigate } from "react-router-dom";

const ViewDiaryPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false); // diary의 즐겨찾기 상태

  // 메뉴 항목 정의: '즐겨찾기' 메뉴는 isPinned 상태에 따라 라벨이 바뀌고,
  // '다이어리 탈퇴하기'는 작고 회색으로 표시될 예정.
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
    {
      label: "다이어리 탈퇴하기",
      onClick: () => {
        // 다이어리 탈퇴 로직을 여기에 추가합니다.
        console.log("Diary deletion action");
      },
      small: true, // 글씨 스타일을 작게/회색 처리하기 위한 커스텀 프로퍼티
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
            <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DialogTrigger asChild>
                <RiMore2Fill className={"text-xl"} />
              </DialogTrigger>
              <DialogContent
                className={cn(
                  "fixed bottom-0 w-full max-w-md bg-white shadow-xl rounded-t-xl transition-all duration-300"
                )}
                style={{ animation: "slideUp 0.3s ease-out" }}
              >
                <div className={"flex flex-col"}>
                  {menuItems.map((item) => (
                    <div
                      key={item.label}
                      className={
                        "flex items-center justify-center p-5 select-none last:border-0 border-b-[0.6px] border-[#979797]"
                      }
                      onClick={() => {
                        item.onClick?.();
                        setIsMenuOpen(false);
                      }}
                    >
                      <div
                        className={
                          item.small
                            ? "text-xs border-b border-gray-400 text-gray-400"
                            : "text-base w-full text-center"
                        }
                      >
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Page.Header>
      <Page.Content>PageContent</Page.Content>
      <Page.Footer>Footer</Page.Footer>

      <style>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </Page.Container>
  );
};

export default ViewDiaryPage;
