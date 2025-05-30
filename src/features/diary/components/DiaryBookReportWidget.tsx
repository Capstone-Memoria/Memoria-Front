import api from "@/api";
import { ShineBorder } from "@/components/magicui/shine-border";
import { cn } from "@/lib/utils";
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
  const { data: statistics, isFetching: isStatisticsFetching } = useQuery({
    queryKey: ["fetchDiaryBookStatistics", diaryBookId],
    queryFn: () =>
      api.statistics.fetchDiaryBookStatistics(
        diaryBookId,
        DateTime.now().toFormat("yyyy-MM")
      ),
    enabled: !!diaryBookId,
  });

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
            <MdAutoAwesome />
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
