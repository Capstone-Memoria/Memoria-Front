import { User } from "@/models/User";
import { DateTime } from "luxon";
import server from "./axios";

interface LoginResponse {
  accessToken: string;
  accessTokenExpiresAt: DateTime;
  user: User;
}

export const login = async (email: string, password: string) => {
  const response = await server.post<LoginResponse>("/api/auth/login", {
    email: email,
    password: password,
  });

  return response.data;
};
