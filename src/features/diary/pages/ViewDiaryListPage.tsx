import api from "@/api";
import Banner from "@/components/base/Banner";
import Input from "@/components/base/Input";
import DiaryListItem from "@/components/diary/DiaryListItem";
import DiaryWriteButton from "@/components/diary/DiaryWriteButton";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IoCalendarOutline, IoSearch } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

const ViewDiaryListPage = () => {
  /* Properties */
  const navigate = useNavigate();
  const { diaryId: diaryBookId } = useParams();

  /* States */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false); // diary의 즐겨찾기 상태
  const [isSearching, setIsSearching] = useState(false); // 검색 입력 필드 표시 상태 추가
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가

  /* Refs */
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for search input
  const headerContentRef = useRef<HTMLDivElement>(null); // Ref for header content

  /* Server Side */
  const { data, isLoading } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryBookId],
    queryFn: () => api.diaryBook.fetchDiaryBookById(Number(diaryBookId)),
  });

  const { data: diaryList, isLoading: isDiaryListLoading } = useQuery({
    queryKey: ["fetchDiaryList", diaryBookId],
    queryFn: () => api.diary.fetchDiaryList(Number(diaryBookId)),
  });

  /* UI */
  const menuItems = [
    {
      label: "일기장 관리",
      onClick: () => navigate(`/diary/${diaryBookId}/manage`),
    },
    {
      label: "일기장 멤버 관리",
      onClick: () => navigate(`/diary/${diaryBookId}/members`),
    },
    {
      label: isPinned ? "즐겨찾기 해제" : "즐겨찾기 추가",

      onClick: async () => {
        const updateFormData = new FormData(); // FormData 생성

        if (diaryBookId) {
          updateFormData.append("diaryBookId", diaryBookId); // API 경로용 ID 추가
          updateFormData.append("isPinned", String(!isPinned)); // 변경할 isPinned 값만 추가
        } else {
          console.error("Diary book ID is missing!");
          setIsMenuOpen(false);
          return;
        }

        try {
          console.log("Updating diary book (pin toggle) with data:", {
            diaryBookId: updateFormData.get("diaryBookId"),
            isPinned: updateFormData.get("isPinned"),
          });
          await api.diaryBook.updateDiaryBook(updateFormData); // isPinned 업데이트 요청
          setIsPinned(!isPinned);
        } catch (e) {
          console.error("즐겨찾기 업데이트 실패", e);
        } finally {
          setIsMenuOpen(false);
        }
      },
    },
  ];

  useEffect(() => {
    if (data) {
      setIsPinned(data.isPinned ?? false);
    }
  }, [data]);

  const openWritePage = () => {
    navigate(`/diary/write/?diaryBookId=${diaryBookId}`);
  };

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl pr-4"}>
          {isSearching ? (
            <MdOutlineKeyboardBackspace
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
            />
          ) : (
            <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
          )}
        </div>
        <AnimatePresence mode={"wait"}>
          {isSearching ? (
            <motion.div
              key={"search"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.225, ease: [0.16, 1, 0.3, 1] }}
              className={"flex flex-grow items-center justify-between"}
            >
              <Input
                ref={searchInputRef}
                icon={<IoSearch className={"text-base"} />}
                placeholder={"작성자, 제목, 내용 검색"}
                className={"text-sm w-full"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          ) : (
            <motion.div
              key={"view"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.225, ease: [0.16, 1, 0.3, 1] }}
              className={"flex flex-grow items-center justify-between "}
              ref={headerContentRef}
            >
              <div>
                {isLoading ? (
                  <div className={"h-5 w-16 bg-gray-200 animate-pulse"} />
                ) : (
                  <>{data?.title}</>
                )}
              </div>
              <div className={"flex gap-1"}>
                <div className={"p-2 flex items-center justify-center"}>
                  <IoSearch
                    className={"text-xl"}
                    onClick={() => setIsSearching(true)}
                  />
                </div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </Page.Header>
      <Page.Content>
        <Banner
          variant={"green"}
          title={"우리 일기장은 어떤 일기장일까?"}
          className={"mt-2"}
        >
          메모리아에게 일기장 분석받기
        </Banner>

        <div className={"flex flex-col gap-4 mt-5"}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={"animate-pulse bg-gray-200 h-24 rounded-md p-4"}
              >
                <div className={"h-3 bg-gray-300 rounded w-3/4 mb-3"} />
                <div className={"h-2 bg-gray-300 rounded w-1/2 mb-2"} />
                <div className={"h-2 bg-gray-300 rounded w-full mb-2"} />
                <div className={"h-2 bg-gray-300 rounded w-5/6"} />
              </div>
            ))
          ) : (
            <>
              {diaryList?.content.map((diary) => (
                <DiaryListItem key={diary.id} item={diary} />
              ))}
            </>
          )}
        </div>
        <DiaryWriteButton
          className={"fixed bottom-20 right-5"}
          onClick={openWritePage}
        />
      </Page.Content>
    </Page.Container>
  );
};

export default ViewDiaryListPage;
