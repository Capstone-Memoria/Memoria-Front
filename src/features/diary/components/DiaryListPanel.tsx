import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

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
  /* Properties */
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* Server Side */
  const PAGE_SIZE = 10; // 한 번에 가져올 일기 개수

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: isDiaryListLoading, // 초기 로딩 상태
    isFetchingNextPage, // 다음 페이지 로딩 상태
  } = useInfiniteQuery({
    queryKey: ["fetchDiaryList", diaryBookId, searchQuery], // searchQuery 추가
    queryFn: ({ pageParam = 0 }) =>
      api.diary.fetchDiaryList(diaryBookId, {
        page: pageParam,
        size: PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // lastPage는 API 응답 전체 (Page<Diary>)
      // lastPage.last는 boolean 값으로, 마지막 페이지인지 여부
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.pageable.pageNumber + 1;
    },
  });

  const { ref, inView } = useInView({
    threshold: 0, // sentinel이 화면에 조금이라도 보이면 inView를 true로 설정
  });

  // 검색어가 변경될 때마다 기존 쿼리를 무효화
  useEffect(() => {
    if (searchQuery !== undefined) {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryList", diaryBookId],
      });
    }
  }, [searchQuery, diaryBookId, queryClient]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !searchQuery) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, searchQuery]);

  // 모든 페이지의 content를 하나의 배열로 합치고 중복 제거
  const diaryListContent = useMemo(() => {
    const allDiaries = data?.pages.flatMap((page) => page.content) || [];
    // ID를 기준으로 중복 제거
    const uniqueDiaries = allDiaries.filter(
      (diary, index, self) => index === self.findIndex((d) => d.id === diary.id)
    );
    return uniqueDiaries;
  }, [data]);

  // 검색어에 따라 일기 필터링
  // TODO: api 레벨에서 검색 기능 추가 필요
  const filteredDiaryList = useMemo(() => {
    return diaryListContent.filter((diary) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        diary.title.toLowerCase().includes(query) ||
        diary.content.toLowerCase().includes(query) ||
        diary.createdBy?.nickName.toLowerCase().includes(query)
      );
    });
  }, [diaryListContent, searchQuery]);

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
      {filteredDiaryList.length > 0 && (
        <DiaryBookReportWidget
          onClick={() => navigate(`/diary-book/${diaryBookId}/report`)}
          diaryBookId={diaryBookId}
        />
      )}
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
            {/* 무한 스크롤 트리거 및 상태 표시 (검색 중이 아닐 때만) */}
            {!searchQuery && filteredDiaryList.length > 0 && (
              <div className={"flex justify-center items-center p-4"}>
                {hasNextPage ? (
                  <div ref={ref}>{isFetchingNextPage ? <Spinner /> : null}</div>
                ) : (
                  <div className={"text-center text-gray-500 text-sm"}>
                    마지막 일기입니다
                  </div>
                )}
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
