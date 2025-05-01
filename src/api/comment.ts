import { Comment, CommentTree } from "../models/Comment";
import server from "./axios";

// COMMENT-1: 댓글 생성
interface CreateCommentRequest {
  content: string;
}

export const createComment = async (
  diaryBookId: number,
  diaryId: number,
  request: CreateCommentRequest
): Promise<Comment> => {
  const response = await server.post(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/comments`,
    request
  );
  return response.data;
};

// COMMENT-2: 대댓글 생성
// 대댓글 생성은 특정 commentId에 대한 POST 요청입니다.
export const createReply = async (
  diaryBookId: number,
  diaryId: number,
  commentId: number,
  request: CreateCommentRequest // 대댓글도 내용은 string 하나만 보냅니다.
): Promise<Comment> => {
  const response = await server.post(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/comments/${commentId}`,
    request
  );
  return response.data;
};

// COMMENT-3: 댓글 수정
interface UpdateCommentRequest {
  content: string;
}

export const updateComment = async (
  diaryBookId: number,
  diaryId: number,
  commentId: number,
  request: UpdateCommentRequest
): Promise<Comment> => {
  const response = await server.patch(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/comments/${commentId}`,
    request
  );
  return response.data;
};

// COMMENT-4: 일기별 댓글(및 대댓글) 목록 조회
export const fetchComments = async (
  diaryBookId: number,
  diaryId: number
): Promise<CommentTree[]> => {
  const response = await server.get(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/comments`
  );
  return response.data;
};

// COMMENT-5: 댓글 삭제
export const deleteComment = async (
  diaryBookId: number,
  diaryId: number,
  commentId: number
): Promise<void> => {
  await server.delete(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/comments/${commentId}`
  );
  // DELETE 요청은 보통 응답 본문이 없습니다.
};

// COMMENT-6: 일기별 댓글 개수 조회
// 설명: 특정 다이어리(diaryId)에 달린 댓글의 총 개수를 조회합니다. (대댓글 포함)
export const fetchCommentsCount = async (
  diaryBookId: number,
  diaryId: number
): Promise<number> => {
  const response = await server.get(
    `/api/diary-book/${diaryBookId}/diary/${diaryId}/comments/count`
  );
  return response.data;
};
