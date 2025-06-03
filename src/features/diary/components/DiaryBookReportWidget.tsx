import api from "@/api";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { ErrorResponse } from "@/models/Error";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import React, { HTMLAttributes } from "react";
import { LuArrowRight } from "react-icons/lu";
import { MdAutoAwesome } from "react-icons/md";

interface DiaryBookReportWidgetProps extends HTMLAttributes<HTMLDivElement> {
  diaryBookId: number;
}

const DiaryBookReportWidget: React.FC<DiaryBookReportWidgetProps> = ({
  className,
  diaryBookId,
  ...props
}) => {
  const {
    data: statistics,
    isFetching: isStatisticsFetching,
    error,
  } = useQuery({
    queryKey: ["fetchDiaryBookStatistics", diaryBookId],
    queryFn: () =>
      api.statistics.fetchDiaryBookStatistics(
        diaryBookId,
        DateTime.now().toFormat("yyyy-MM")
      ),
    retry: false,
    enabled: !!diaryBookId,
  });

  if (isStatisticsFetching) {
    return (
      <div
        {...props}
        className={cn(
          "relative border border-gray-300 bg-white shadow-lg p-4 rounded-lg items-center gap-4 overflow-hidden",
          className
        )}
      >
        <div className={"flex "}>
          <div className={"flex flex-col gap-1 flex-1"}>
            <div className={"flex items-center gap-2"}>
              <Skeleton className={"w-12 h-6 rounded-full"} />
              <div className={"flex flex-col gap-2 flex-1"}>
                <Skeleton className={"h-4 w-full"} />
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            "text-xs text-gray-500 text-end mt-1 flex items-center gap-1 justify-end"
          }
        >
          <Skeleton className={"h-3 w-20"} />
        </div>
      </div>
    );
  }

  const errorResponse = error as ErrorResponse | null;
  if (errorResponse) {
    if (errorResponse.statusCode === 404) {
      return (
        <div
          {...props}
          className={cn(
            "relative border border-gray-300 bg-white shadow-lg p-4 rounded-lg items-center gap-4 overflow-hidden",
            className
          )}
        >
          <BorderBeam
            duration={6}
            size={40}
            className={"from-transparent via-red-500 to-transparent"}
          />
          <BorderBeam
            duration={6}
            delay={3}
            size={40}
            className={"from-transparent via-blue-500 to-transparent"}
          />
          <div className={"flex "}>
            <div className={"flex flex-col gap-1 flex-1"}>
              <div className={"flex items-center gap-2"}>
                <MdAutoAwesome className={"basis-[48px] text-gray-400"} />
                <div className={"text-gray-500 text-sm"}>
                  분석 보고서가 생성 중이에요. 조금만 기다려주세요!
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      {...props}
      className={cn(
        "relative border border-gray-300 bg-white shadow-lg p-4 rounded-lg items-center gap-4 overflow-hidden transition-transform active:scale-95",
        className
      )}
    >
      <ShineBorder shineColor={["#fb2c36", "#2b7fff"]} />

      <div className={"flex "}>
        <div className={"flex flex-col gap-1 flex-1"}>
          <div className={"flex items-center gap-2"}>
            <MdAutoAwesome className={"basis-[48px]"} />
            <div className={"font-semibold "}>{statistics?.oneLineSummary}</div>
          </div>
        </div>
      </div>
      <div
        className={
          "text-xs text-gray-500 text-end mt-1 flex items-center gap-1 justify-end"
        }
      >
        일기장 분석 보기 <LuArrowRight />
      </div>
    </div>
  );
};

export default DiaryBookReportWidget;
