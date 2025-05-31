import cloudyImage from "@/assets/images/weathers/cloudy.png";
import nightImage from "@/assets/images/weathers/night.png";
import rainbowImage from "@/assets/images/weathers/rainbow.png";
import rainyImage from "@/assets/images/weathers/rainy.png";
import snowyImage from "@/assets/images/weathers/snowy.png";
import sunnyImage from "@/assets/images/weathers/sunny.png";
import sunnyAndCloudyImage from "@/assets/images/weathers/sunny_and_cloudy.png";
import windyImage from "@/assets/images/weathers/windy.png";
import { cn } from "@/lib/utils";
import {
  AttendanceRankingItem,
  CommentRankingItem,
  EmotionWeather,
  ReactionRankingItem,
} from "@/models/DiaryBookStatistics";
import { HTMLAttributes } from "react";
import { MdFilterDrama } from "react-icons/md";

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
  longSummary?: string;
}

const WhatIsOurDiaryBookWidget: React.FC<WhatIsOurDiaryBookWidgetProps> = ({
  diaryBookName,
  oneLineSummary,
  longSummary,
}) => {
  return (
    <BaseDiaryBookReportWidget
      title={"우리 일기장에 대해서"}
      className={"text-center"}
    >
      {diaryBookName && oneLineSummary ? (
        <div className={"flex flex-col gap-4"}>
          <div className={"text-left font-semibold"}>{oneLineSummary}</div>
          <div className={"text-left text-gray-500 text-sm"}>
            <span className={"break-keep"}>{longSummary}</span>
          </div>
        </div>
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
  let imageSrc;
  switch (weather) {
    case "SUNNY":
      imageSrc = sunnyImage;
      break;
    case "NIGHT":
      imageSrc = nightImage;
      break;
    case "RAINBOW":
      imageSrc = rainbowImage;
      break;
    case "SNOWY":
      imageSrc = snowyImage;
      break;
    case "SUNNY_AND_CLOUDY":
      imageSrc = sunnyAndCloudyImage;
      break;
    case "WINDY":
      imageSrc = windyImage;
      break;
    case "CLOUDY":
      imageSrc = cloudyImage;
      break;
    case "RAINY":
      imageSrc = rainyImage;
      break;
    default:
      imageSrc = cloudyImage; // 기본값으로 흐린 날씨 이미지 사용 또는 다른 기본 이미지 설정
      break;
  }
  return <img src={imageSrc} alt={weather} className={"size-32"} />;
};

const getEmotionWeatherText = (weather?: EmotionWeather): string => {
  switch (weather) {
    case "SUNNY":
      return "화창한 날씨";
    case "NIGHT":
      return "고요한 밤하늘";
    case "RAINBOW":
      return "일곱 빛깔 무지개";
    case "SNOWY":
      return "눈이 내리는 중";
    case "SUNNY_AND_CLOUDY":
      return "구름 조금 맑음";
    case "WINDY":
      return "바람이 부는 날씨";
    case "CLOUDY":
      return "흐린 날씨";
    case "RAINY":
      return "비가 내리는 중";
    default:
      return "날씨 분석 중...";
  }
};

const DiaryEmotionWeatherForecastWidget: React.FC<
  DiaryEmotionWeatherForecastWidgetProps
> = ({ emotionWeather, emotionWeatherReason }) => {
  return (
    <BaseDiaryBookReportWidget title={"우리 일기장의 감정 날씨는?"}>
      <div className={"flex flex-col items-center gap-3"}>
        <div className={""}>
          {emotionWeather ? (
            <EmotionIcon weather={emotionWeather} />
          ) : (
            <MdFilterDrama className={"text-gray-500"} />
          )}
        </div>
        {emotionWeather && (
          <p className={"text-xl font-bold text-gray-700"}>
            {getEmotionWeatherText(emotionWeather)}
          </p>
        )}
        {emotionWeatherReason ? (
          <p className={"text-sm text-gray-500 break-words"}>
            {emotionWeatherReason}
          </p>
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
  const sortedRanking = attendanceRanking
    ?.slice() // 원본 배열 변경 방지를 위해 복사본 사용
    .sort((a, b) => b.diaryCount - a.diaryCount); // 출석 횟수 내림차순 정렬

  return (
    <BaseDiaryBookReportWidget title={"한달간 일기장 출석 랭킹"}>
      {sortedRanking && sortedRanking.length > 0 ? (
        <div className={"space-y-3"}>
          {sortedRanking.map((item, index) => (
            <div
              key={item.userNickname}
              className={`flex items-center justify-between rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-150 border ${
                index < 3 ? "p-3 bg-gray-50" : "p-2 bg-white"
              }`}
            >
              <div className={"flex items-center space-x-3"}>
                <span
                  className={`flex items-center justify-center rounded-full font-semibold text-white ${
                    index === 0
                      ? "bg-yellow-400 size-8"
                      : index === 1
                        ? "bg-blue-400 size-8"
                        : index === 2
                          ? "bg-orange-400 size-8"
                          : "bg-gray-300 size-6 text-sm"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`font-medium ${
                    index < 3 ? "text-gray-700" : "text-gray-600 text-sm"
                  }`}
                >
                  {item.userNickname}
                </span>
              </div>
              <span
                className={`text-sm ${
                  index < 3 ? "text-gray-600" : "text-gray-500 text-xs"
                }`}
              >
                {item.diaryCount}회 출석
              </span>
            </div>
          ))}
        </div>
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
