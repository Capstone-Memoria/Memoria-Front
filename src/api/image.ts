import { AuthenticationStore } from "@/stores/AuthenticationStore";

export const fetchImage = async (imageId: string) => {
  const authStore = AuthenticationStore.getState();
  if (!authStore.isAuthenticated()) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`/api/files/image/${imageId}`, {
    headers: {
      Authorization: `Bearer ${authStore.context?.accessToken}`,
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }

  return response.blob();
};
