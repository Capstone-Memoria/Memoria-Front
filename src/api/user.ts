import { DateTime } from "luxon";
import server from "./axios";

interface User {
  userEmail: string;
  nickName: string;
  createdAt: DateTime;
  lastModifiedAt: DateTime;
}

export const getUser = async (userEmail: string) => {
  const response = await server.get<User>(`/api/user/${userEmail}`);
  return response.data;
};

export const updateUser = async (
  userEmail: string,
  nickName: string,
  password: string
) => {
  const updateData: Record<string, string> = {};
  if (nickName) updateData.nickName = nickName;
  if (password) updateData.password = password;

  const response = await server.patch<User>(
    `/api/user/${userEmail}`,
    updateData
  );
  return response.data;
};
