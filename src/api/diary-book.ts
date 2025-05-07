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

// 스티커 아이템 타입 정의
export interface StickerItem {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

interface DiaryBookCreateRequest {
  title: string;
  coverImage: File;
  stickers?: StickerItem[];
}

export const createDiaryBook = async (request: DiaryBookCreateRequest) => {
  const formData = new FormData();
  formData.append("title", request.title);
  formData.append("coverImage", request.coverImage);

  // 스티커 정보가 있으면 JSON 문자열로 변환하여 추가
  if (request.stickers && request.stickers.length > 0) {
    formData.append("stickers", JSON.stringify(request.stickers));
  }

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
  stickers?: StickerItem[];
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
  if (request.stickers)
    formData.append("stickers", JSON.stringify(request.stickers));

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
