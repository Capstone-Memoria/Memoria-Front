import { useInfiniteQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useInView } from "react-intersection-observer";

import api from "@/api";
import Banner from "@/components/base/Banner";
import Input from "@/components/base/Input";
import Spinner from "@/components/base/Spinner";
import DiaryListItem from "@/components/diary/DiaryListItem";
import DiaryWriteButton from "@/components/diary/DiaryWriteButton";
import { Diary } from "@/models/Diary";

interface DiaryListPanelProps {
  diaryBookId: number;
  onNavigateBack: () => void;
  onOpenWritePage: () => void;
  onSearchToggle: (isSearching: boolean) => void;
  isSearching: boolean;
}

const DiaryListPanel = ({
  diaryBookId,
  onOpenWritePage,
  isSearching,
}: DiaryListPanelProps) => {
  /* States */
  const [searchQuery, setSearchQuery] = useState("");

  /* Refs */
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* Server Side */
  const PAGE_SIZE = 10; // 한 번에 가져올 일기 개수

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: isDiaryListLoading, // 초기 로딩 상태
    isFetchingNextPage, // 다음 페이지 로딩 상태
  } = useInfiniteQuery({
    queryKey: ["fetchDiaryList", diaryBookId],
    queryFn: ({ pageParam = 0 }) =>
      api.diary.fetchDiaryList(diaryBookId, {
        page: pageParam,
        size: PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // lastPage는 API 응답 전체 (Page<Diary>)
      // lastPage.last는 boolean 값으로, 마지막 페이지인지 여부
      return lastPage.last ? undefined : lastPage.number + 1;
    },
  });

  const { ref, inView } = useInView({
    threshold: 0, // sentinel이 화면에 조금이라도 보이면 inView를 true로 설정
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 모든 페이지의 content를 하나의 배열로 합침
  const diaryListContent = data?.pages.flatMap((page) => page.content) || [];

  // 다이어리를 날짜별로 그룹화하는 함수
  const groupDiariesByDate = (diaries: Diary[]) => {
    if (!diaries) return {};
    return diaries.reduce(
      (acc, diary) => {
        const date = DateTime.fromISO(
          diary.createdAt as unknown as string
        ).toFormat("yyyy년 MM월 dd일");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(diary);
        return acc;
      },
      {} as Record<string, Diary[]>
    );
  };

  const groupedDiaries = groupDiariesByDate(diaryListContent);
  const sortedDates = Object.keys(groupedDiaries).sort((a, b) => {
    // 날짜 문자열을 DateTime 객체로 변환하여 비교
    const dateA = DateTime.fromFormat(a, "yyyy년 MM월 dd일");
    const dateB = DateTime.fromFormat(b, "yyyy년 MM월 dd일");
    return dateB.toMillis() - dateA.toMillis(); // 내림차순 정렬
  });

  return (
    <>
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
        ) : null}
      </AnimatePresence>

      <Banner
        variant={"green"}
        title={"우리 일기장은 어떤 일기장일까?"}
        className={"mt-2"}
      >
        메모리아에게 일기장 분석받기
      </Banner>

      <div className={"flex flex-col gap-4 mt-5"}>
        {isDiaryListLoading && diaryListContent.length === 0 ? ( // 초기 로딩 중이고, 아직 데이터가 없을 때
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={"animate-pulse bg-gray-200 h-24 rounded-md p-4"}
            ></div>
          ))
        ) : (
          <>
            {diaryListContent.length > 0
              ? sortedDates.map((date) => (
                  <div key={date} className={"flex flex-col gap-2"}>
                    <div className={"text-sm font-semibold text-gray-700 my-1"}>
                      {DateTime.fromFormat(date, "yyyy년 MM월 dd일").hasSame(
                        DateTime.now(),
                        "day"
                      )
                        ? "오늘"
                        : date}
                    </div>
                    {groupedDiaries[date].map((diary) => (
                      <DiaryListItem key={diary.id} item={diary} />
                    ))}
                  </div>
                ))
              : // 초기 로딩이 끝났는데도 데이터가 없는 경우
                !isDiaryListLoading &&
                !isFetchingNextPage && (
                  <div className={"text-center text-gray-500 mt-10"}>
                    아직 작성된 일기가 없어요. 첫 일기를 작성해보세요!
                  </div>
                )}
            {/* 무한 스크롤 트리거 및 로딩 인디케이터 */}
            {hasNextPage && (
              <div ref={ref} className={"flex justify-center items-center p-4"}>
                {isFetchingNextPage ? <Spinner /> : null}
              </div>
            )}
          </>
        )}
      </div>
      <DiaryWriteButton
        className={"fixed bottom-20 right-5"}
        onClick={onOpenWritePage}
      />
    </>
  );
};

export default DiaryListPanel;
