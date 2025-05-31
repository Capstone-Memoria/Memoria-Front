import api from "@/api";
import { fetchDiaryBookStatistics } from "@/api/statistics";
import { BorderBeam } from "@/components/magicui/border-beam";
import Page from "@/components/page/Page";
import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { MdAutoAwesome, MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import DiaryBookReportWidgets from "../components/report/DiaryBookReportWidgets";

const ReportPageSkeleton = () => (
  <div className={"p-4"}>
    <div className={"flex justify-between items-center"}>
      <Skeleton className={"h-8 w-3/4"} />
      <Skeleton className={"h-8 w-16"} />
    </div>
    <Skeleton className={"h-4 w-1/2 mt-2"} />
    <div className={"mt-8 flex flex-col gap-6"}>
      <Skeleton className={"h-48 w-full"} />
      <Skeleton className={"h-32 w-full"} />
      <Skeleton className={"h-64 w-full"} />
      <Skeleton className={"h-64 w-full"} />
    </div>
  </div>
);

const DiaryBookReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { diaryBookId } = useParams<{ diaryBookId: string }>();

  const { data: diaryBook, isFetching: isDiaryBookFetching } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryBookId],
    queryFn: () => api.diaryBook.fetchDiaryBookById(Number(diaryBookId)),
    enabled: !!diaryBookId,
  });

  const today = new Date();
  const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  const { data: statistics, isFetching: isStatisticsFetching } = useQuery({
    queryKey: ["fetchDiaryBookStatistics", diaryBookId, month],
    queryFn: () => fetchDiaryBookStatistics(Number(diaryBookId), month),
    enabled: !!diaryBookId,
  });

  if (isDiaryBookFetching || isStatisticsFetching) {
    return (
      <Page.Container>
        <Page.Header>
          <div
            className={"text-2xl pr-4 cursor-pointer"}
            onClick={() => navigate(-1)}
          >
            <MdOutlineKeyboardBackspace />
          </div>
          <div className={"flex-grow text-lg font-semibold"}>분석 보고서</div>
        </Page.Header>
        <Page.Content className={""}>
          <ReportPageSkeleton />
        </Page.Content>
      </Page.Container>
    );
  }

  return (
    <Page.Container>
      <Page.Header>
        <div
          className={"text-2xl pr-4 cursor-pointer"}
          onClick={() => navigate(-1)}
        >
          <MdOutlineKeyboardBackspace />
        </div>
        <div className={"flex-grow text-lg font-semibold"}>분석 보고서</div>
      </Page.Header>
      <Page.Content className={""}>
        <div className={"p-4"}>
          <div className={"flex justify-between items-center"}>
            <div className={"text-xl font-semibold"}>
              <span className={"text-green-500"}>{diaryBook?.title}</span>의
              분석 보고서
            </div>

            <div
              className={
                "bg-white px-3 py-1 rounded-full border relative text-sm font-semibold flex items-center gap-2"
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
            {(!diaryBook || !statistics) &&
              !(isDiaryBookFetching || isStatisticsFetching) && (
                <div>데이터를 불러오는데 실패했습니다.</div>
              )}
            {diaryBook &&
              statistics &&
              !(isDiaryBookFetching || isStatisticsFetching) && (
                <>
                  <DiaryBookReportWidgets.WhatIsOurDiaryBookWidget
                    diaryBookName={diaryBook.title}
                    oneLineSummary={statistics.oneLineSummary}
                    longSummary={statistics.longSummary}
                  />
                  <DiaryBookReportWidgets.DiaryEmotionWeatherForecastWidget
                    emotionWeather={statistics.emotionWeather}
                    emotionWeatherReason={statistics.emotionWeatherReason}
                  />
                  <DiaryBookReportWidgets.MonthlyAttendanceRankingWidget
                    attendanceRanking={statistics.attendanceRanking}
                  />
                  <DiaryBookReportWidgets.PopularDiariesWidget
                    commentRanking={statistics.commentRanking}
                    reactionRanking={statistics.reactionRanking}
                  />
                </>
              )}
          </div>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default DiaryBookReportPage;
