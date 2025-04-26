import server from "./axios";

export const generateCoverImage = async (description: string) => {
  const response = await server.post<string>("/api/ai/cover-image", {
    description,
  });

  return response.data;
};
