import api from "@/api";
import Button from "@/components/base/Button";
import DiaryBookComponent from "@/components/diary/DiaryBook";
import DiaryWriteButton from "@/components/diary/DiaryWriteButton";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { DiaryBook } from "@/models/DiaryBook";
import { Page as PageType } from "@/models/Pagination";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* Server-State */
  const { data, isLoading } = useQuery<PageType<DiaryBook>>({
    queryKey: ["fetchMyDiaryBook"],
    queryFn: () =>
      api.diaryBook.fetchMyDiaryBook({
        size: 10,
        page: 1, // TODO: pagination
      }),
  });

  /* States */
  const [tab, setTab] = useState<"all" | "pinned">("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDiaryBook, setSelectedDiaryBook] = useState<DiaryBook | null>(
    null
  );

  const filteredDiaryBooks = useMemo(() => {
    if (tab === "all") {
      return data?.content ?? [];
    } else if (tab === "pinned") {
      return (data?.content ?? []).filter((book) => book.isPinned); // TODO: filter by pinned
    }
    return [];
  }, [tab, data]);

  const handleMenuClick = (e: React.MouseEvent, diaryBook: DiaryBook) => {
    e.stopPropagation();
    setSelectedDiaryBook(diaryBook);
    setIsMenuOpen(true);
  };

  const handlePinToggle = async () => {
    if (!selectedDiaryBook) return;

    try {
      await api.diaryBook.togglePinDiaryBook(Number(selectedDiaryBook.id));
      // 데이터 리프레시를 위해 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] });
    } catch (e) {
      console.error("즐겨찾기 업데이트 실패", e);
    } finally {
      setIsMenuOpen(false);
    }
  };

  const handleDiaryExit = async () => {
    if (!selectedDiaryBook) return;

    try {
      // TODO: 다이어리 탈퇴 API 구현 필요
      // await api.diaryBook.exitDiaryBook(Number(selectedDiaryBook.id));
      // 데이터 리프레시를 위해 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] });
      setIsMenuOpen(false);
    } catch (e) {
      console.error("다이어리 탈퇴 실패", e);
    }
  };

  const menuItems = selectedDiaryBook
    ? [
        {
          label: "일기장 관리",
          onClick: () => navigate(`/diary-book/${selectedDiaryBook.id}/manage`),
        },
        {
          label: "일기장 멤버 관리",
          onClick: () =>
            navigate(`/diary-book/${selectedDiaryBook.id}/members`),
        },
        {
          label: selectedDiaryBook.isPinned ? "즐겨찾기 해제" : "즐겨찾기 추가",
          onClick: handlePinToggle,
        },
      ]
    : [];

  return (
    <Page.Container className={"h-full flex flex-col"}>
      <DefaultHeader />
      <div className={"px-4 py-6"}>
        <div className={"my-6 flex items-center justify-between"}>
          <div>
            <p className={"font-semibold text-xl"}>
              {authStore.context?.user?.nickName} 님의 책장,
            </p>
            <p className={"font-regular text-gray-1 text-sm"}>
              {filteredDiaryBooks.length}권의 일기장
            </p>
          </div>
          <Button
            size={"sm"}
            className={"flex items-center gap-2"}
            onClick={() => navigate("/create-diary")}
          >
            <BookPlus className={"size-4"} />새 일기장
          </Button>
        </div>
      </div>
      <div className={"flex pl-6 gap-4"}>
        <button
          className={cn(
            "px-5 py-2 rounded-t-xl text-sm font-normal",
            tab === "all" ? "bg-white text-black" : "bg-gray-100 text-gray-400"
          )}
          onClick={() => setTab("all")}
        >
          모든 일기
        </button>
        <button
          className={cn(
            "px-5 py-2 rounded-t-xl text-sm font-normal",
            tab === "pinned"
              ? "bg-white text-black"
              : "bg-gray-100 text-gray-400"
          )}
          onClick={() => setTab("pinned")}
        >
          즐겨 찾는
        </button>
      </div>
      {/* Tab Content Container */}
      <div className={"w-full overflow-x-hidden flex-1 bg-white"}>
        <div
          className={cn(
            "flex w-[200%] transition-transform duration-600 ease-expo-out",
            tab === "pinned" ? "-translate-x-1/2" : "translate-x-0"
          )}
        >
          {/* All Diaries Tab Content */}
          <div className={"w-1/2  py-8"}>
            <div className={"px-6"}>
              <div className={"grid grid-cols-3 gap-x-6 gap-y-8"}>
                {isLoading
                  ? Array.from({ length: 9 }).map((_, index) => (
                      <div
                        key={index}
                        className={"animate-pulse bg-gray-200 h-32 rounded-sm"}
                      />
                    ))
                  : (data?.content ?? []).map((diaryBook) => (
                      <DiaryBookComponent
                        onClick={() => navigate(`/diary-book/${diaryBook.id}`)}
                        key={diaryBook.id}
                        diaryBook={diaryBook}
                        onMenuClick={handleMenuClick}
                      />
                    ))}
              </div>
            </div>
          </div>

          {/* Pinned Diaries Tab Content */}
          <div className={"w-1/2 py-8"}>
            <div className={"px-6"}>
              <div className={"grid grid-cols-3 gap-6"}>
                {isLoading
                  ? Array.from({ length: 9 }).map((_, index) => (
                      <div
                        key={index}
                        className={"animate-pulse bg-gray-200 h-32 rounded-sm"}
                      />
                    ))
                  : (data?.content ?? [])
                      .filter((book) => book.isPinned)
                      .map((diaryBook) => (
                        <DiaryBookComponent
                          onClick={() =>
                            navigate(`/diary-book/${diaryBook.id}`)
                          }
                          key={diaryBook.id}
                          diaryBook={diaryBook}
                          onMenuClick={handleMenuClick}
                        />
                      ))}
                {(data?.content ?? []).filter((book) => book.isPinned)
                  .length === 0 && !isLoading ? (
                  <div
                    className={
                      "col-span-full text-center text-gray-400 text-sm py-20"
                    }
                  >
                    즐겨찾는 일기장이 없습니다.
                    <br />
                    일기장 관리에서 즐겨찾기를 설정할 수 있어요.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DiaryWriteButton
        className={"fixed bottom-20 right-5"}
        onClick={() => navigate("/diary/write")}
      />

      {/* Drawer for Menu */}
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent className={""}>
          <div className={"flex flex-col gap-2 p-4"}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsMenuOpen(false);
                }}
                className={
                  "text-center text-base font-normal w-full px-4 pt-4 pb-5 border-b border-gray-400 last:border-b-0"
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </Page.Container>
  );
};

export default MainPage;
