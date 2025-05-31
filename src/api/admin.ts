import { AiNode, AiNodeType } from "@/models/AiNode";
import server from "./axios";

interface CreateAiNodeRequest {
  url: string;
  type: AiNodeType;
}

export const getAllAiNodes = async () => {
  const response = await server.get<AiNode[]>("/api/ai/config/nodes");
  return response.data;
};

export const createAiNode = async (request: CreateAiNodeRequest) => {
  const response = await server.post<AiNode>("/api/ai/config/nodes", request);

  return response.data;
};

type UpdateAiNodeRequest = Partial<CreateAiNodeRequest>;

export const updateAiNode = async (
  id: number,
  request: UpdateAiNodeRequest
) => {
  const response = await server.put<AiNode>(
    `/api/ai/config/nodes/${id}`,
    request
  );

  return response.data;
};

export const deleteAiNode = async (id: number) => {
  const response = await server.delete<AiNode>(`/api/ai/config/nodes/${id}`);

  return response.data;
};

export interface QueueStatus {
  imageNodeQueueSize: number;
  musicNodeQueueSize: number;
  musicNodePendingJobsCount: number;
}

export const getAiNodeQueueStatus = async () => {
  const response = await server.get<QueueStatus>(
    "/api/ai/config/nodes/queue-status"
  );
  return response.data;
};
