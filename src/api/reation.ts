import { Reaction, ReactionType } from "../models/Diary";
import server from "./axios";

// REACTION-1: 다이어리 반응 남기기/수정/취소 (API 명세에 따른 수정)
export const handleReaction = async (
  diaryBookId: number,
  diaryId: number,
  reactionType: ReactionType | undefined
): Promise<Reaction | void> => {
  const response = await server.put(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/reaction`,
    { reactionType }
  );
  // API spec says 200 OK for create/update, 204 No Content for delete
  if (response.status === 200) {
    return response.data; // Reaction object for create/update
  } else if (response.status === 204) {
    return; // void for delete (No Content)
  } else {
    // Handle unexpected status codes
    throw new Error(`Unexpected status code: ${response.status}`);
  }
};

// REACTION-2: 다이어리별 반응 목록 조회
export const fetchReactions = async (
  diaryBookId: number,
  diaryId: number
): Promise<Reaction[]> => {
  const response = await server.get(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/reaction`
  );
  return response.data;
};
