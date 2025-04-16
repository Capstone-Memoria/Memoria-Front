import api from "@/api";
import Button from "@/components/base/Button";
import DiaryBook from "@/components/diary/DiaryBook";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  /* Server-State */
  const { data, isLoading } = useQuery({
    queryKey: ["fetchMyDiaries"],
    queryFn: () =>
      api.diary.fetchMyDiaries({
        size: 10,
        page: 1, // TODO: pagination
      }),
  });

  /* States */
  const [tab, setTab] = useState<"all" | "pinned">("all");

  const filteredDiaryBooks = useMemo(() => {
    if (tab === "all") {
      return data?.content ?? [];
    } else if (tab === "pinned") {
      return data?.content ?? []; // TODO: filter by pinned
    }
    return [];
  }, [tab, data]);

  return (
    <Page.Container>
      <DefaultHeader />
      <Page.Content>
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
            size={"xs"}
            variant={"secondary"}
            onClick={() => navigate("/create-diary")}
          >
            새 일기장
          </Button>
        </div>
      </Page.Content>
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
      <div className={"bg-white h-full min-h-[calc(100vh-160px)] py-8"}>
        <div className={"px-6"}>
          <div className={"grid grid-cols-3 gap-6"}>
            {isLoading
              ? Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className={"animate-pulse bg-gray-200 h-32 rounded-sm"}
                  />
                ))
              : null}
            {filteredDiaryBooks.length === 0 && tab === "pinned" ? (
              <div
                className={
                  "col-span-full text-center text-gray-400 text-sm py-20"
                }
              >
                즐겨찾는 일기장이 없습니다.
                <br />
                일기장 관리에서 즐겨찾기를 설정할 수 있어요.
              </div>
            ) : (
              filteredDiaryBooks.map((diaryBook) => (
                <DiaryBook
                  onClick={() => navigate(`/diary/${diaryBook.id}`)}
                  key={diaryBook.id}
                  title={diaryBook.title}
                  memberCount={1}
                  pinned={false}
                  notificationCount={1}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Page.Container>
  );
};

export default MainPage;
