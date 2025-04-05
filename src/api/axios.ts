import { AuthenticationStore } from "@/stores/AuthenticationStore";
import { parseDateTime } from "@/utils/json-util";
import axios from "axios";
import qs from "qs";

export const server = axios.create({});

server.defaults.paramsSerializer = (params) =>
  qs.stringify(params, {
    arrayFormat: "repeat",
  });

/**
 * 요청을 보내기 전에, AccessToken이 있는 경우, 헤더에 추가하는 인터셉터입니다.
 */
server.interceptors.request.use((req) => {
  const authContext = AuthenticationStore.getState();
  if (authContext.isAuthenticated() && req.headers.RefreshTry !== "true")
    req.headers.Authorization = `Bearer ${authContext.context?.accessToken}`;

  return req;
});

/**
 *
 * Error가 발생했을경우 Error Response의 Body를 Promise.reject로 반환합니다.
 */
server.interceptors.response.use(
  (res) => {
    res.data = parseDateTime(res.data);
    return res;
  },
  async (err) => {
    const res = err.response;
    if (res.status === 401) {
      const authState = AuthenticationStore.getState();
      authState.logout();
      return Promise.reject(res.data);
    }

    return Promise.reject(res.data);
  }
);

export default server;
