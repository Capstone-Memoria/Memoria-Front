import { DiaryBookStatistics } from "@/models/DiaryBookStatistics";
import server from "./axios";

export const fetchDiaryBookStatistics = async (
  diaryBookId: number,
  month: string // yyyy-MM 형식
) => {
  const response = await server.get<DiaryBookStatistics>(
    `/api/statistics/diary-book/${diaryBookId}`,
    {
      params: {
        month,
      },
    }
  );

  return response.data;
};
