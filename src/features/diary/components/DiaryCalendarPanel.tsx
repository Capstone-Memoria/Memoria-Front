import api from "@/api";
import DiaryListItem from "@/components/diary/DiaryListItem";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface DiaryCalendarPanelProps {
  diaryBookId: number;
}

/**
 * 일기장의 일기들을 캘린더 형식으로 표시하는 컴포넌트입니다.
 */
const DiaryCalendarPanel = ({ diaryBookId }: DiaryCalendarPanelProps) => {
  // 현재 선택된 년월
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  // 캘린더에서 선택된 날짜
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(null);

  // 현재 월의 첫째 날과 마지막 날
  const firstDayOfMonth = DateTime.fromObject({
    year: currentDate.year,
    month: currentDate.month,
    day: 1,
  });

  const lastDayOfMonth = firstDayOfMonth.endOf("month");

  // 서버에서 해당 월의 일기 데이터 가져오기
  const { data: diaryList, isLoading } = useQuery({
    queryKey: [
      "fetchDiaryListByDate",
      diaryBookId,
      currentDate.toFormat("yyyy-MM"),
    ],
    queryFn: () =>
      api.diary.fetchDiaryByDateRange(
        diaryBookId,
        firstDayOfMonth,
        lastDayOfMonth
      ),
    // keepPreviousData: true, // 필요하다면 이전 데이터를 유지하여 부드러운 전환 효과
  });

  // 현재 월의 시작 요일 (1: 월요일, ..., 7: 일요일)
  // luxon에서는 요일이 1(월)~7(일)이므로 일요일을 0으로 맞추기 위해 조정
  const startDay = firstDayOfMonth.weekday % 7;

  // 현재 월의 총 일수
  const totalDays = lastDayOfMonth.day;

  // 달력에 표시할 주 배열 생성
  const weeks = [];
  let days = [];

  // 첫째 주 시작 전 빈 칸 추가
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // 날짜 채우기
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);

    // 토요일이거나 마지막 날이면 주 완성
    if ((startDay + i) % 7 === 0 || i === totalDays) {
      weeks.push(days);
      days = [];
    }
  }

  // 이전 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(currentDate.minus({ months: 1 }));
    setSelectedDate(null); // 월 변경 시 선택된 날짜 초기화
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(currentDate.plus({ months: 1 }));
    setSelectedDate(null); // 월 변경 시 선택된 날짜 초기화
  };

  // 특정 날짜 선택 핸들러
  const handleDayClick = (day: number | null) => {
    if (day === null) return;
    const clickedDate = DateTime.fromObject({
      year: currentDate.year,
      month: currentDate.month,
      day: day,
    });
    setSelectedDate(clickedDate);
  };

  // 현재 날짜 확인 함수
  const isToday = (day: number) => {
    const now = DateTime.now();
    return (
      day === now.day &&
      currentDate.month === now.month &&
      currentDate.year === now.year
    );
  };

  // 일기가 있는 날짜인지 확인하는 함수
  const hasDiary = (day: number) => {
    if (!diaryList) return false;
    const targetDate = DateTime.fromObject({
      year: currentDate.year,
      month: currentDate.month,
      day: day,
    });
    // YYYY-MM-DD 형식으로 비교
    const targetDateString = targetDate.toFormat("yyyy-MM-dd");
    return diaryList.some(
      (diary) => diary.createdAt.toFormat("yyyy-MM-dd") === targetDateString
    );
  };

  // 선택된 날짜의 일기 목록 필터링
  const selectedDateDiaries = selectedDate
    ? diaryList?.filter(
        (diary) =>
          DateTime.fromISO(diary.createdAt.toISO()!).toFormat("yyyy-MM-dd") ===
          selectedDate.toFormat("yyyy-MM-dd")
      ) || []
    : []; // 선택된 날짜가 없으면 빈 배열

  return (
    <div className={"mt-4"}>
      {/* 캘린더 헤더 */}
      <div className={"flex justify-between items-center mb-4"}>
        <div
          onClick={goToPrevMonth}
          className={"p-2 active:scale-95 transition-all"}
        >
          <ChevronLeft />
        </div>
        <h2 className={"text-lg font-medium"}>
          {currentDate.toFormat("yyyy년 MM월")}
        </h2>
        <div
          onClick={goToNextMonth}
          className={"p-2 active:scale-95 transition-all"}
        >
          <ChevronRight />
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className={"grid grid-cols-7 text-center font-medium text-sm mb-2"}>
        <div className={"text-red-500"}>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div className={"text-blue-500"}>토</div>
      </div>

      {/* 캘린더 본문 */}
      {isLoading ? (
        <div className={"animate-pulse bg-gray-200 h-64 rounded-md"}></div>
      ) : (
        <div className={"grid gap-1"}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={"grid grid-cols-7 gap-1"}>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "aspect-square p-1 flex flex-col items-center justify-center border rounded-md transition-all",
                    day && "cursor-pointer hover:bg-gray-100",
                    selectedDate &&
                      day &&
                      selectedDate.hasSame(
                        DateTime.fromObject({
                          year: currentDate.year,
                          month: currentDate.month,
                          day: day,
                        }),
                        "day"
                      ) &&
                      "border-blue-500 border-2",
                    isToday(day as number) &&
                      "text-green-500 underline underline-offset-4"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  {day && (
                    <>
                      <span className={"text-sm"}>{day}</span>
                      {/* 일기가 있는 날에는 표시 */}
                      {hasDiary(day as number) && (
                        <div
                          className={"w-1 h-1 bg-green-500 rounded-full mt-1"}
                        ></div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 선택된 날짜의 일기 목록 */}
      <div className={"mt-8"}>
        <h3 className={"text-lg font-medium mb-4"}>
          {selectedDate
            ? `${selectedDate.toFormat("yyyy년 MM월 dd일")}의 일기`
            : "날짜를 선택하면 일기를 볼 수 있어요."}
        </h3>
        <div className={"grid gap-4"}>
          <AnimatePresence mode={"sync"}>
            {selectedDateDiaries.length > 0 ? (
              selectedDateDiaries.map((diary, index) => (
                <motion.div
                  key={diary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.225,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.01,
                  }}
                >
                  <DiaryListItem key={diary.id} item={diary} />
                </motion.div>
              ))
            ) : selectedDate ? (
              <div className={"text-center text-gray-500"}>
                선택된 날짜에 일기가 없어요.
              </div>
            ) : (
              <div className={"text-center text-gray-500"}></div> // 초기 상태
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DiaryCalendarPanel;
