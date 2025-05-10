import { AIComment } from "@/models/AIComment";
import server from "./axios";

export const fetchAiComments = async (diaryId: number) => {
  const response = await server.get<AIComment[]>(
    `/api/diary/${diaryId}/ai-comments`
  );

  return response.data;
};
