import { Diary } from "@/models/Diary";
import server from "./axios";

// 타입 정의
interface QueueItemResponse {
  uuid: string;
  timestamp: string;
  requestedAt: string;
  diary: Diary;
  retryCountDown: number;
  processingNodeUrl: string;
  status: string;
}

interface QueueListResponse {
  pendingItems: QueueItemResponse[];
  processingItems: QueueItemResponse[];
  totalPendingCount: number;
  totalProcessingCount: number;
}

interface ReorderQueueRequest {
  itemUuid: string;
  newPosition: number;
}

interface DeleteQueueItemResponse {
  success: boolean;
  deletedItemUuid: string;
  message: string;
}

export const generateCoverImage = async (description: string) => {
  const response = await server.post<string>("/api/ai/cover-image", {
    description,
  });

  return response.data;
};

// 뮤직 큐 목록 조회
export const getMusicQueue = async (): Promise<QueueListResponse> => {
  const response = await server.get<QueueListResponse>(
    "/api/ai/config/music/queue"
  );
  return response.data;
};

// 뮤직 큐 아이템 순서 변경
export const reorderMusicQueueItem = async (
  request: ReorderQueueRequest
): Promise<string> => {
  const response = await server.put<string>(
    "/api/ai/config/music/queue/reorder",
    request
  );
  return response.data;
};

// 뮤직 큐 아이템 삭제
export const deleteMusicQueueItem = async (
  itemUuid: string
): Promise<DeleteQueueItemResponse> => {
  const response = await server.delete<DeleteQueueItemResponse>(
    `/api/ai/config/music/queue/${itemUuid}`
  );
  return response.data;
};
