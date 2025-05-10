import {
  DiaryBookMemer,
  DirectInvaitation,
  InvitationCode,
} from "@/models/DiaryBook";
import server from "./axios";

// 초대 목록 조회
export const fetchInvitations = async (): Promise<DirectInvaitation[]> => {
  const response = await server.get<DirectInvaitation[]>(
    "/api/invitations/received"
  );
  return response.data;
};

export const createInviteCode = async (diaryBookId: number) => {
  const response = await server.post<InvitationCode>(
    `/api/diaries/${diaryBookId}/invitation/by-code`,
    {
      hours: 24,
    }
  );

  return response.data;
};

export const acceptInvitationCode = async (code: string) => {
  const response = await server.post<DiaryBookMemer>(
    "/api/invitation/accept/by-code",
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
    "/api/invitation/accept/by-direct",
    {
      id: id,
    }
  );

  return responcse.data;
};

export const declineDirectInvite = async (id: number) => {
  await server.delete(`/api/invitations/${id}`);
};