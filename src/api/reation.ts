import { Reaction, ReactionType } from "../models/Diary";
import server from "./axios";

// REACTION-1: 공감 추가
export const addReaction = async (
  diaryBookId: number,
  diaryId: number,
  reactionType: ReactionType
): Promise<Reaction> => {
  const response = await server.post(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/reaction`,
    { reactionType }
  );
  return response.data;
};

// REACTION-2: 공감 수정
export const updateReaction = async (
  diaryBookId: number,
  diaryId: number,
  reactionType: ReactionType
): Promise<Reaction> => {
  const response = await server.put(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/reaction`,
    { reactionType }
  );
  return response.data;
};

// REACTION-3: 공감 삭제
export const deleteReaction = async (
  diaryBookId: number,
  diaryId: number
): Promise<void> => {
  await server.delete(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/reaction`
  );
};

// REACTION-4: 특정 일기의 모든 공감 조회
export const fetchReactions = async (
  diaryBookId: number,
  diaryId: number
): Promise<Reaction[]> => {
  const response = await server.get(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/reaction`
  );
  return response.data;
};
