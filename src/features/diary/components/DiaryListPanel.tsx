import { useInfiniteQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import api from "@/api";
import Spinner from "@/components/base/Spinner";
import DiaryListItem from "@/components/diary/DiaryListItem";
import DiaryWriteButton from "@/components/diary/DiaryWriteButton";
import { Diary } from "@/models/Diary";
import DiaryBookReportWidget from "./DiaryBookReportWidget";

interface DiaryListPanelProps {
  diaryBookId: number;
  onNavigateBack: () => void;
  onOpenWritePage: () => void;
  onSearchToggle: (isSearching: boolean) => void;
  isSearching: boolean;
  searchQuery: string; // searchQuery prop 추가
}

const DiaryListPanel = ({
  diaryBookId,
  onOpenWritePage,
  searchQuery, // searchQuery prop 사용
}: DiaryListPanelProps) => {
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

  // 검색어에 따라 일기 필터링
  // TODO: api 레벨에서 검색 기능 추가 필요
  const filteredDiaryList = diaryListContent.filter((diary) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      diary.title.toLowerCase().includes(query) ||
      diary.content.toLowerCase().includes(query) ||
      diary.createdBy?.nickName.toLowerCase().includes(query)
    );
  });

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

  const groupedDiaries = groupDiariesByDate(filteredDiaryList); // 필터링된 리스트 사용
  const sortedDates = Object.keys(groupedDiaries).sort((a, b) => {
    // 날짜 문자열을 DateTime 객체로 변환하여 비교
    const dateA = DateTime.fromFormat(a, "yyyy년 MM월 dd일");
    const dateB = DateTime.fromFormat(b, "yyyy년 MM월 dd일");
    return dateB.toMillis() - dateA.toMillis(); // 내림차순 정렬
  });

  return (
    <>
      <DiaryBookReportWidget />
      <div className={"flex flex-col gap-4 mt-5"}>
        {isDiaryListLoading &&
        filteredDiaryList.length === 0 &&
        !searchQuery ? ( // 초기 로딩 중이고, 아직 데이터가 없고, 검색어가 없을 때
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={"animate-pulse bg-gray-200 h-24 rounded-md p-4"}
            ></div>
          ))
        ) : (
          <>
            {filteredDiaryList.length > 0 ? (
              sortedDates.map((date) => (
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
            ) : // 데이터가 없거나, 검색 결과가 없는 경우
            !isDiaryListLoading &&
              !isFetchingNextPage &&
              searchQuery &&
              filteredDiaryList.length === 0 ? (
              <div className={"text-center text-gray-500 mt-10"}>
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className={"text-center text-gray-500 mt-10"}>
                아직 작성된 일기가 없어요. 첫 일기를 작성해보세요!
              </div>
            )}
            {/* 무한 스크롤 트리거 및 로딩 인디케이터 (검색 중이 아닐 때만) */}
            {hasNextPage && !searchQuery && (
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
