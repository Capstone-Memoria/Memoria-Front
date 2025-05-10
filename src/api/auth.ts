import { User } from "@/models/User";
import { DateTime } from "luxon";
import server from "./axios";

interface LoginResponse {
  accessToken: string;
  accessTokenExpiresAt: DateTime;
  user: User;
}

// HTTP통신이란?
// 클라이언트랑 서버 사이에 작동하는 프로토콜

// request 를 서버에게 보낸다.
// response를 서버에서 받는다.

// request
// 1. Header [key: value]
//    - Authorization: Bearer {accessToken}
//    - Content-Type: application/json
//    - Accept: application/json
//    - Accept-Language: ko
// 2. Body // JSON -> Rest API (Optional)
// 3. Method //   - GET, POST, PUT, PATCH, DELETE
// GET - 데이터를 주세요
// POST - 데이터를 보낼게요 (생성해주세요)
// PUT - 데이터를 수정할게요 (내가 보낸걸 그대로 적용해주세요)
// PATCH - 데이터를 수정할게요 (내가 보낸부분만 수정해주세요)
// DELETE - 데이터를 삭제할게요 (삭제해주세요)

// response
// 1. Header
// 2. Body //    - JSON
// 3. Status Code


export const login = async (email: string, password: string) => {
  const response = await server.post<LoginResponse>("/api/auth/login", {
    email: email,
    password: password,
  });

  return response.data;
};

type RegisterResponse = User;

interface RegisterRequest {
  email: string;
  password: string;
  nickName: string;
}

export const register = async (request: RegisterRequest) => {
  const response = await server.post<RegisterResponse>(
    "/api/auth/register",
    request
  );

  return response.data;
};

export const emailCheck = async (email: string) => {
  const response = await server.post("/api/auth/email-exist", {
    email: email,
  });

  return response.data;
}

