import { BorderBeam } from "@/components/magicui/border-beam";
import React from "react";
import { LuArrowRight } from "react-icons/lu";
import { MdAutoAwesome } from "react-icons/md";
const DiaryBookReportWidget: React.FC = () => {
  return (
    <div
      className={
        "relative border border-gray-300 bg-white shadow-lg p-4 rounded-lg items-center gap-4 overflow-hidden transition-transform active:scale-95"
      }
    >
      <BorderBeam
        duration={6}
        size={130}
        className={"from-transparent via-red-500 to-transparent"}
      />
      <BorderBeam
        duration={6}
        delay={3}
        size={130}
        className={"from-transparent via-blue-500 to-transparent"}
      />

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
