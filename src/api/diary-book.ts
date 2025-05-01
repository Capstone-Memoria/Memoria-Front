import { Diary } from "@/models/Diary";
import {
  DiaryBook,
  DiaryBookMemer,
  DirectInvaitation,
  InvitationCode,
} from "@/models/DiaryBook";
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

// interface DiaryBookUpdateRequest {
//   title?: string;
//   isPinned?: boolean;
//   coverImage?: string;
// }

export const updateDiaryBook = async (formData: FormData) => {
  const response = await server.patch<DiaryBook>(
    `/api/diary-book/${formData.get("diaryBookId")}`,
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

export const createInviteCode = async (diaryBookId: number) => {
  const response = await server.post<InvitationCode>(
    `/api/diaries/${diaryBookId}/invitation/by-code`
  );

  return response.data;
};

export const acceptInvitationCode = async (code: string) => {
  const response = await server.post<DiaryBookMemer>(
    "/api/invitaion/accept/by-codee",
    {
      code: code,
    }
  );

  return response.data;
};

export const directInvite = async (
  diaryBookId: number,
  targetEmail: string
) => {
  const response = await server.post<DirectInvaitation>(
    `/api/diaries/${diaryBookId}/invitation/by-direct`,
    {
      targetEmail: targetEmail,
    }
  );

  return response.data;
};

export const directInviteAccept = async (id: number) => {
  const responcse = await server.post<DiaryBookMemer>(
    "/api/invitaion/accept/by-direct",
    {
      id: id,
    }
  );

  return responcse.data;
};

export const diaryMemberDelete = async (
  diaryBookId: number,
  memberId: number
) => {
  await server.delete(`/api/diary-book/${diaryBookId}/members/${memberId}`);
};

export const fetchDiaryMembers = async (diaryBookId: number) => {
  const responcse = await server.get<DiaryBookMemer[]>(
    `/api/diary-book/${diaryBookId}/members`
  );

  return responcse.data;
};
