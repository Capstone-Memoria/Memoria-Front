import { cn } from "@/lib/utils";
import {
  AttendanceRankingItem,
  CommentRankingItem,
  EmotionWeather,
  ReactionRankingItem,
} from "@/models/DiaryBookStatistics";
import { HTMLAttributes } from "react";
import { FaRainbow } from "react-icons/fa";
import {
  MdAcUnit,
  MdAir,
  MdFilterDrama,
  MdOutlineNightsStay,
  MdSunny,
  MdWbCloudy,
} from "react-icons/md";
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

interface WhatIsOurDiaryBookWidgetProps {
  diaryBookName?: string;
  oneLineSummary?: string;
}

const WhatIsOurDiaryBookWidget: React.FC<WhatIsOurDiaryBookWidgetProps> = ({
  diaryBookName,
  oneLineSummary,
}) => {
  return (
    <BaseDiaryBookReportWidget
      title={"우리 일기장은 어떤 일기장일까?"}
      className={"text-center"}
    >
      {diaryBookName && oneLineSummary ? (
        <>
          <span className={"text-green-500"}>{diaryBookName}</span>
          <span>{`은 "${oneLineSummary}"같습니다.`}</span>
        </>
      ) : (
        "데이터를 불러오는 중입니다..."
      )}
    </BaseDiaryBookReportWidget>
  );
};

interface DiaryEmotionWeatherForecastWidgetProps {
  emotionWeather?: EmotionWeather;
  emotionWeatherReason?: string;
}

const EmotionIcon: React.FC<{ weather?: EmotionWeather }> = ({ weather }) => {
  switch (weather) {
    case "SUNNY":
      return <MdSunny className={"text-yellow-500"} />;
    case "NIGHT":
      return <MdOutlineNightsStay className={"text-indigo-500"} />;
    case "RAINBOW":
      return <FaRainbow className={"text-purple-500"} />;
    case "SNOWY":
      return <MdAcUnit className={"text-blue-300"} />;
    case "SUNNY_AND_CLOUDY":
      return <MdWbCloudy className={"text-gray-400"} />;
    case "WINDY":
      return <MdAir className={"text-green-400"} />;
    default:
      return <MdFilterDrama className={"text-gray-500"} />;
  }
};

const DiaryEmotionWeatherForecastWidget: React.FC<
  DiaryEmotionWeatherForecastWidgetProps
> = ({ emotionWeather, emotionWeatherReason }) => {
  return (
    <BaseDiaryBookReportWidget title={"우리 일기장의 감정 날씨는?"}>
      <div className={"flex flex-col items-center gap-3"}>
        <div className={"text-6xl"}>
          {emotionWeather ? (
            <EmotionIcon weather={emotionWeather} />
          ) : (
            <MdFilterDrama className={"text-gray-500"} />
          )}
        </div>
        {emotionWeatherReason ? (
          <p className={"text-lg font-semibold"}>{emotionWeatherReason}</p>
        ) : (
          <p className={"text-lg font-semibold"}>
            감정 날씨를 분석 중입니다...
          </p>
        )}
      </div>
    </BaseDiaryBookReportWidget>
  );
};

interface MonthlyAttendanceRankingWidgetProps {
  attendanceRanking?: AttendanceRankingItem[];
}

const MonthlyAttendanceRankingWidget: React.FC<
  MonthlyAttendanceRankingWidgetProps
> = ({ attendanceRanking }) => {
  const data =
    attendanceRanking?.map((item) => ({
      name: item.userNickname,
      출석: item.diaryCount,
    })) || [];

  return (
    <BaseDiaryBookReportWidget title={"한달간 일기장 출석 랭킹"}>
      {data.length > 0 ? (
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray={"3 3"} />
            <XAxis dataKey={"name"} />
            <YAxis orientation={"right"} width={25} />
            <Tooltip />
            <Legend />
            <Bar barSize={10} dataKey={"출석"} fill={"#8884d8"} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className={"text-center text-gray-500"}>
          출석 데이터를 불러오는 중이거나 데이터가 없습니다.
        </p>
      )}
    </BaseDiaryBookReportWidget>
  );
};

interface PopularDiariesWidgetProps {
  commentRanking?: CommentRankingItem[];
  reactionRanking?: ReactionRankingItem[];
}

const PopularDiariesWidget: React.FC<PopularDiariesWidgetProps> = ({
  commentRanking,
  reactionRanking,
}) => {
  const mostCommented =
    commentRanking && commentRanking.length > 0 ? commentRanking[0] : null;
  const mostReacted =
    reactionRanking && reactionRanking.length > 0 ? reactionRanking[0] : null;

  return (
    <BaseDiaryBookReportWidget title={"일기 명예의 전당"}>
      <div className={"space-y-4"}>
        <div>
          <h4 className={"font-semibold text-blue-500"}>
            댓글이 가장 많은 일기
          </h4>
          {mostCommented ? (
            <div className={"mt-1 rounded-md bg-blue-50 p-3"}>
              <p className={"font-medium"}>{mostCommented.diaryTitle}</p>
              <p className={"text-xs text-gray-500"}>
                - 댓글 {mostCommented.count}개
              </p>
            </div>
          ) : (
            <p className={"text-sm text-gray-500 mt-1"}>
              데이터를 불러오는 중이거나 데이터가 없습니다.
            </p>
          )}
        </div>
        <div>
          <h4 className={"font-semibold text-pink-600"}>
            공감을 가장 많이 받은 일기
          </h4>
          {mostReacted ? (
            <div className={"mt-1 rounded-md bg-pink-50 p-3"}>
              <p className={"font-medium"}>{mostReacted.diaryTitle}</p>
              <p className={"text-xs text-gray-500"}>
                - 공감 {mostReacted.count}개
              </p>
            </div>
          ) : (
            <p className={"text-sm text-gray-500 mt-1"}>
              데이터를 불러오는 중이거나 데이터가 없습니다.
            </p>
          )}
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
