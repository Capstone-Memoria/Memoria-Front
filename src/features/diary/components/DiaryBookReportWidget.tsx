import { ShineBorder } from "@/components/magicui/shine-border";
import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";
import { LuArrowRight } from "react-icons/lu";
import { MdAutoAwesome } from "react-icons/md";

type DiaryBookReportWidgetProps = HTMLAttributes<HTMLDivElement>;

const DiaryBookReportWidget: React.FC<DiaryBookReportWidgetProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "relative border border-gray-300 bg-white shadow-lg p-4 rounded-lg items-center gap-4 overflow-hidden transition-transform active:scale-95",
        className
      )}
    >
      {/* <BorderBeam
        duration={6}
        size={130}
        className={"from-transparent via-red-500 to-transparent"}
      />
      <BorderBeam
        duration={6}
        delay={3}
        size={130}
        className={"from-transparent via-blue-500 to-transparent"}
      /> */}
      <ShineBorder shineColor={["#fb2c36", "#2b7fff"]} />

      <div className={"flex "}>
        <div className={"flex flex-col gap-1 flex-1"}>
          <div className={"flex items-center gap-2"}>
            <MdAutoAwesome />
            <div className={"font-semibold "}>
              친구들과 함께하는 도란도란 일기장
            </div>
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
