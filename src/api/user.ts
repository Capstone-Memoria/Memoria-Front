import { User } from "@/models/User";
import server from "./axios";

export const getUser = async (userEmail: string) => {
  const response = await server.get<User>(`/api/user/${userEmail}`);
  return response.data;
};

interface UpdateUserRequest {
  nickName?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const updateUser = async (email: string, request: UpdateUserRequest) => {
  const response = await server.patch<User>(`/api/user/${email}`, request);
  return response.data;
};
