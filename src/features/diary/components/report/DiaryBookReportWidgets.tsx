import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { MdSunny } from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BaseDiaryBookReportWidgetProps
  extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const BaseDiaryBookReportWidget: React.FC<BaseDiaryBookReportWidgetProps> = ({
  className,
  children,
  title,
  ...props
}) => {
  return (
    <div className={"flex flex-col gap-2"}>
      <div>{title}</div>
      <div {...props} className={cn("p-4 bg-white rounded-lg", className)}>
        {children}
      </div>
    </div>
  );
};

const WhatIsOurDiaryBookWidget = () => {
  return (
    <BaseDiaryBookReportWidget
      title={"우리 일기장은 어떤 일기장일까?"}
      className={"text-center"}
    >
      <span className={"text-green-500"}>일기장 이름</span> 은 "일기장
      설명"같습니다.
    </BaseDiaryBookReportWidget>
  );
};

const DiaryEmotionWeatherForecastWidget = () => {
  return (
    <BaseDiaryBookReportWidget title={"우리 일기장의 감정 날씨는?"}>
      <div className={"flex flex-col items-center gap-3"}>
        <div className={"text-6xl"}>
          <MdSunny className={"text-yellow-500"} />
        </div>{" "}
        {/* Sunny, Cloudy, Rainy, etc. */}
        <p className={"text-lg font-semibold"}>이번 주 감정은 대체로 '맑음'</p>
        <p className={"text-sm text-gray-600"}>
          긍정적인 감정이 주를 이루고 있어요
        </p>
      </div>
    </BaseDiaryBookReportWidget>
  );
};

const MonthlyAttendanceRankingWidget = () => {
  const dummyData = [
    {
      name: "멋쟁이토마토",
      출석: 28,
    },
    {
      name: "행복한강아지",
      출석: 25,
    },
    {
      name: "긍정적인고양이",
      출석: 22,
    },
  ];

  return (
    <BaseDiaryBookReportWidget title={"한달간 일기장 출석 랭킹"}>
      <ResponsiveContainer width={"100%"} height={300}>
        <BarChart data={dummyData}>
          <CartesianGrid strokeDasharray={"3 3"} />
          <XAxis dataKey={"name"} />
          <YAxis orientation={"right"} width={25} />
          <Tooltip />
          <Legend />
          <Bar barSize={10} dataKey={"출석"} fill={"#8884d8"} />
        </BarChart>
      </ResponsiveContainer>
    </BaseDiaryBookReportWidget>
  );
};

const PopularDiariesWidget = () => {
  return (
    <BaseDiaryBookReportWidget title={"일기 명예의 전당"}>
      <div className={"space-y-4"}>
        <div>
          <h4 className={"font-semibold text-blue-500"}>
            댓글이 가장 많은 일기
          </h4>
          <div className={"mt-1 rounded-md bg-blue-50 p-3"}>
            <p className={"font-medium"}>오늘의 소확행</p>
            <p className={"text-xs text-gray-500"}>
              - 친절한너구리님, 5개의 댓글
            </p>
          </div>
        </div>
        <div>
          <h4 className={"font-semibold text-pink-600"}>
            공감을 가장 많이 받은 일기
          </h4>
          <div className={"mt-1 rounded-md bg-pink-50 p-3"}>
            <p className={"font-medium"}>힘든 하루 끝에 찾아온 위로</p>
            <p className={"text-xs text-gray-500"}>
              - 따뜻한코알라님, 32개의 공감
            </p>
          </div>
        </div>
      </div>
    </BaseDiaryBookReportWidget>
  );
};

export default {
  WhatIsOurDiaryBookWidget,
  DiaryEmotionWeatherForecastWidget,
  MonthlyAttendanceRankingWidget,
  PopularDiariesWidget,
};
