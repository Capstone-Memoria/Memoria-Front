import { Diary } from "@/models/Diary";
import { DiaryBook, DiaryBookMemer } from "@/models/DiaryBook";
import { Page, PageParam } from "@/models/Pagination";
import { Sticker } from "@/models/Sticker";
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
  spineColor: string;
}

export const createDiaryBook = async (request: DiaryBookCreateRequest) => {
  const formData = new FormData();
  formData.append("title", request.title);
  formData.append("coverImage", request.coverImage);
  formData.append("spineColor", request.spineColor);

  const response = await server.post<DiaryBook>("api/diary-book", formData);

  return response.data;
};

interface DiaryBookCreateWithStickersRequest extends DiaryBookCreateRequest {
  stickers: Sticker[];
}

export const createDiaryBookWithStickers = async (
  request: DiaryBookCreateWithStickersRequest
) => {
  const response = await createDiaryBook(request);
  const diaryBookId = response.id;

  await updateStickers(diaryBookId, request.stickers);

  return response;
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
  spineColor?: string;
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
  if (request.spineColor) formData.append("spineColor", request.spineColor);

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

export const diaryMemberDelete = async (
  diaryBookId: number,
  memberId: number
) => {
  await server.delete(`/api/diary-book/${diaryBookId}/members/${memberId}`);
};

export const updateDiaryMemberPermission = async ({
  diaryBookId,
  memberId,
  permission,
}: {
  diaryBookId: number;
  memberId: number;
  permission: "ADMIN" | "MEMBER";
}) => {
  const response = await server.patch<DiaryBookMemer>(
    `/api/diary-book/${diaryBookId}/members/${memberId}`,
    { permission }
  );
  return response.data;
};

export const fetchDiaryMembers = async (diaryBookId: number) => {
  const responcse = await server.get<DiaryBookMemer[]>(
    `/api/diary-book/${diaryBookId}/members`
  );

  return responcse.data;
};

export const updateStickers = async (
  diaryBookId: number,
  stickers: Sticker[]
) => {
  await server.put(`/api/diary-book/${diaryBookId}/stickers`, {
    stickers,
  });
};
