import { AICharacter, AIComment } from "@/models/AIComment";
import server from "./axios";

export const fetchAiComments = async (diaryId: number) => {
  const response = await server.get<AIComment[]>(
    `/api/diary/${diaryId}/ai-comments`
  );

  return response.data;
};

export const fethAiCharactersByDiaryBookId = async (diaryBookId: number) => {
  const response = await server.get<AICharacter[]>(
    `/api/diary-book/${diaryBookId}/custom-characters`
  );

  return response.data;
};

interface UpdateAiCharacterRequest {
  name?: string;
  feature?: string;
  accent?: string;
  profileImage?: File;
}

export const updateAiCharacter = async (
  characterId: number,
  request: UpdateAiCharacterRequest
) => {
  const formData = new FormData();
  if (request.name) {
    formData.append("name", request.name);
  }
  if (request.feature) {
    formData.append("feature", request.feature);
  }
  if (request.accent) {
    formData.append("accent", request.accent);
  }
  if (request.profileImage) {
    formData.append("profileImage", request.profileImage);
  }

  const response = await server.patch<AICharacter>(
    `/api/custom-characters/${characterId}`,
    formData
  );

  return response.data;
};

export interface CreateAiCharacterRequest {
  name: string;
  feature: string;
  accent: string;
  profileImage: File;
}

export const createAiCharacter = async (
  diaryBookId: number,
  request: CreateAiCharacterRequest
) => {
  const formData = new FormData();
  formData.append("name", request.name);
  formData.append("feature", request.feature);
  formData.append("accent", request.accent);
  formData.append("profileImage", request.profileImage);

  const response = await server.post<AICharacter>(
    `/api/diary-book/${diaryBookId}/custom-characters`,
    formData
  );

  return response.data;
};

export const deleteAiCharacter = async (characterId: number) => {
  await server.delete(`/api/custom-characters/${characterId}`);
};
