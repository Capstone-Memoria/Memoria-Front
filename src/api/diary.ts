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

// interface DiaryBookCreateRequest {
//   title: string;
// }

export const createDiaryBook = async (formData: FormData) => {
  const response = await server.post<DiaryBook>("api/diary-book", formData);

  return response.data;
};

export const fetchDiaryBookById = async (diaryBookId: number) => {
  const response = await server.get<DiaryBook>(
    `/api/diary-book/${diaryBookId}`
  );

  return response.data;
};

interface DiaryBookUpdateRequest {
  title?: string;
  isPinned?: boolean;
}

export const updateDiaryBook = async (
  diaryBookId: number,
  request: DiaryBookUpdateRequest
) => {
  const response = await server.patch<DiaryBook>(
    `/api/diary-book/${diaryBookId}`,
    request
  );
  return response.data;
};

export const deleteDiaryBook = async (diaryBookId: number) => {
  await server.delete(`/api/diary-book/${diaryBookId}`);
};
