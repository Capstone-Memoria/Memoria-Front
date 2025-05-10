import { AuthenticationStore } from "@/stores/AuthenticationStore";

export const fetchFile = async (fileId: string) => {
  const authStore = AuthenticationStore.getState();
  if (!authStore.isAuthenticated()) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(`/api/files/download/${fileId}`, {
    headers: {
      Authorization: `Bearer ${authStore.context?.accessToken}`,
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch file");
  }

  return response.blob();
};
