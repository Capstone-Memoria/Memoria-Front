import { Diary } from "@/models/Diary";
import { DiaryBook } from "@/models/DiaryBook";
import { Page, PageParam } from "@/models/Pagination";
import server from "./axios";

export const fetchMyDiaryBook = async (PageParam: PageParam) => {
  const response = await server.get<Page<DiaryBook>>("/api/diary-book", {
    params: {
      ...PageParam,
    },
  });

  return response.data;
};

interface DiaryBookCreateRequest {
  title: string;
  coverImage: File;
}

export const createDiaryBook = async (request: DiaryBookCreateRequest) => {
  const formData = new FormData();
  formData.append("title", request.title);
  formData.append("coverImage", request.coverImage);

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
  coverImage?: File;
}

export const updateDiaryBook = async (
  diaryBookId: number,
  request: DiaryBookUpdateRequest
) => {
  const formData = new FormData();
  if (request.title) formData.append("title", request.title);
  if (request.isPinned)
    formData.append("isPinned", request.isPinned.toString());
  if (request.coverImage) formData.append("coverImage", request.coverImage);

  const response = await server.patch<DiaryBook>(
    `/api/diary-book/${diaryBookId}`,
    formData
  );
  return response.data;
};

export const deleteDiaryBook = async (diaryBookId: number) => {
  await server.delete(`/api/diary-book/${diaryBookId}`);
};

export const fetchMyDiaries = async (
  diaryBookId: number,
  PageParam: PageParam
) => {
  const response = await server.get<Page<Diary>>(
    `/api/diary-book/${diaryBookId}/diary`,
    {
      params: {
        ...PageParam,
      },
    }
  );
  return response.data;
};
