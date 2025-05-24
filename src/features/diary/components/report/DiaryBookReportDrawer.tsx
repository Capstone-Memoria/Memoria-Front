import api from "@/api";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { MdAutoAwesome } from "react-icons/md";
import DiaryBookReportWidgets from "./DiaryBookReportWidgets";

interface DiaryBookReportDrawerProps {
  diaryBookId: number;
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DiaryBookReportDrawer: React.FC<DiaryBookReportDrawerProps> = ({
  diaryBookId,
  open,
  setIsOpen,
}) => {
  const { data: diaryBook, isFetching: isDiaryBookFetching } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryBookId],
    queryFn: () => api.diaryBook.fetchDiaryBookById(Number(diaryBookId)),
    enabled: !!diaryBookId,
  });

  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerTitle className={"hidden"}>일기장 분석 보고서</DrawerTitle>
      <DrawerDescription className={"hidden"}>
        AI가 이번달의 일기들을 분석한 결과를 알려드릴게요
      </DrawerDescription>
      <DrawerContent
        className={"h-[80%] bg-gray-100"}
        thumbClassName={"!bg-gray-300"}
      >
        <div className={"p-6 overflow-y-auto"}>
          <div className={"flex justify-between items-center"}>
            <div className={"text-xl font-semibold"}>
              <span className={"text-green-500"}>{diaryBook?.title}</span>의
              분석 보고서
            </div>

            <div
              className={
                "bg-white px-3 py-1 rounded-full border relative text-sm  font-semibold flex items-center gap-2"
              }
            >
              <BorderBeam
                size={30}
                className={"from-transparent via-orange-500 to-transparent"}
                duration={6}
              />
              <BorderBeam
                size={30}
                className={"from-transparent via-blue-500 to-transparent"}
                delay={3}
                duration={6}
              />
              <MdAutoAwesome className={"text-sm"} />
              AI
            </div>
          </div>
          <div className={"text-sm mt-2 text-gray-700"}>
            AI가 이번달의 일기들을 분석한 결과를 알려드릴게요
          </div>
          <div className={"mt-8 flex flex-col gap-6"}>
            <DiaryBookReportWidgets.WhatIsOurDiaryBookWidget />
            <DiaryBookReportWidgets.DiaryEmotionWeatherForecastWidget />
            <DiaryBookReportWidgets.MonthlyAttendanceRankingWidget />
            <DiaryBookReportWidgets.PopularDiariesWidget />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DiaryBookReportDrawer;
