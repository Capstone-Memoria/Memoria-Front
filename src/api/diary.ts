import { DiaryBook } from "@/models/DiaryBook";
import { Page, PageParam } from "@/models/Pagination";
import server from "./axios";

export const fetchMyDiaries = async (PageParam: PageParam) => {
  const response = await server.get<Page<DiaryBook>>("/api/diary-book", {
    params: {
      ...PageParam,
    },
  });

  return response.data;
};
