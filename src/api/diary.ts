import { DateTime } from "luxon";
import { Diary } from "../models/Diary";
import { Page, PageParam } from "../models/Pagination";
import server from "./axios";

//images는 MultipartFile 타입
interface CreateDiaryRequest {
  title: string;
  content: string;
  images?: File[];
  emotion?: string;
  desiredCharacterId?: number;
  isAICommentEnabled: boolean;
  isAIMusicEnabled: boolean;
}

export const createDiary = async (
  diaryBookId: number,
  request: CreateDiaryRequest
) => {
  const formData = new FormData();
  formData.append("title", request.title);
  formData.append("content", request.content);
  formData.append(
    "isAICommentEnabled",
    request.isAICommentEnabled ? "true" : "false"
  );
  formData.append(
    "isAIMusicEnabled",
    request.isAIMusicEnabled ? "true" : "false"
  );

  if (request.desiredCharacterId) {
    formData.append(
      "desiredCharacterId",
      request.desiredCharacterId.toString()
    );
  }

  if (request.emotion) {
    formData.append("emotion", request.emotion);
  }

  if (request.images) {
    request.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await server.post(
    `/api/diary-book/${diaryBookId}/diary`,
    formData
  );
  return response.data;
};

// DIARY-2: 특정 일기 조회
export const fetchDiary = async (
  diaryBookId: number,
  diaryId: number
): Promise<Diary> => {
  const response = await server.get(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}`
  );
  return response.data;
};

// DIARY-3: 다이어리 북 내 일기 목록 조회 (페이징)
export const fetchDiaryList = async (
  diaryBookId: number,
  params?: PageParam
): Promise<Page<Diary>> => {
  const response = await server.get(`/api/diary-book/${diaryBookId}/diary`, {
    params,
  });
  return response.data;
};

// DIARY-4: 일기 수정
interface UpdateDiaryRequest {
  title?: string;
  content?: string;
  toDeleteImageIds?: string[]; // Array of image UUIDs to delete
  toAddImages?: File[]; // Array of new image files
}

export const updateDiary = async (
  diaryBookId: number,
  diaryId: number,
  request: UpdateDiaryRequest
): Promise<Diary> => {
  const formData = new FormData();
  if (request.title !== undefined) {
    formData.append("title", request.title);
  }
  if (request.content !== undefined) {
    formData.append("content", request.content);
  }
  if (request.toDeleteImageIds) {
    request.toDeleteImageIds.forEach((id) => {
      formData.append("toDeleteImageIds", id);
    });
  }
  if (request.toAddImages) {
    request.toAddImages.forEach((image) => {
      formData.append("toAddImages", image);
    });
  }

  // Axios handles setting the correct Content-Type for FormData
  const response = await server.patch(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}`,
    formData
  );
  return response.data;
};

// DIARY-5: 일기 삭제
export const deleteDiary = async (
  diaryBookId: number,
  diaryId: number
): Promise<void> => {
  await server.delete(`/api/diary-book/${diaryBookId}/diary/${diaryId}`);
  // DELETE request with 204 No Content typically doesn't return a body
};

export const fetchDiaryByDateRange = async (
  diaryBookId: number,
  startDate: DateTime,
  endDate: DateTime
): Promise<Diary[]> => {
  const response = await server.get(
    `/api/diary-book/${diaryBookId}/diary/by-date`,
    {
      params: {
        startDate: startDate.toFormat("yyyy-MM-dd"),
        endDate: endDate.toFormat("yyyy-MM-dd"),
      },
    }
  );
  return response.data;
};
