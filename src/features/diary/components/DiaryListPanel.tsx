import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";

import api from "@/api";
import Banner from "@/components/base/Banner";
import Input from "@/components/base/Input";
import DiaryListItem from "@/components/diary/DiaryListItem";
import DiaryWriteButton from "@/components/diary/DiaryWriteButton";

interface DiaryListPanelProps {
  diaryBookId: number;
  onNavigateBack: () => void;
  onOpenWritePage: () => void;
  onSearchToggle: (isSearching: boolean) => void;
  isSearching: boolean;
}

const DiaryListPanel = ({
  diaryBookId,
  onNavigateBack,
  onOpenWritePage,
  onSearchToggle,
  isSearching,
}: DiaryListPanelProps) => {
  /* States */
  const [searchQuery, setSearchQuery] = useState("");

  /* Refs */
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* Server Side */
  const { data: diaryList, isLoading: isDiaryListLoading } = useQuery({
    queryKey: ["fetchDiaryList", diaryBookId],
    queryFn: () => api.diary.fetchDiaryList(diaryBookId),
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
        {isDiaryListLoading ? (
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
            {diaryList?.content && diaryList.content.length > 0 ? (
              diaryList.content.map((diary) => (
                <DiaryListItem key={diary.id} item={diary} />
              ))
            ) : (
              <div className={"text-center text-gray-500 mt-10"}>
                아직 작성된 일기가 없어요. 첫 일기를 작성해보세요!
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
