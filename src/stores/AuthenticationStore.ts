import { User } from "@/models/User";
import { parseJsonWithDateTime } from "@/utils/json-util";
import { DateTime } from "luxon";
import { createStore, useStore } from "zustand";

interface AuthenticationContext {
  user?: User;
  accessToken?: string;
  accessTokenExpiresAt?: DateTime;
}

type AuthenticationState = {
  context?: AuthenticationContext;

  isAuthenticated: () => boolean;
  login: (context: AuthenticationContext) => void;
  logout: () => void;
};

/**
 * localStorage에 저장된 인증 정보를 불러옵니다.
 * @returns 저장된 인증 정보를 반환합니다. 없을 경우 undefined를 반환합니다.
 */
const loadStoredContext = (): AuthenticationContext | undefined => {
  const stored = localStorage.getItem("authContext");
  if (!stored) {
    return undefined;
  }

  return parseJsonWithDateTime(stored) as AuthenticationContext;
};

export const AuthenticationStore = createStore<AuthenticationState>(
  (set, get) => {
    return {
      context: loadStoredContext(),

      isAuthenticated: () => {
        const authState = get();
        return authState.context?.accessToken !== undefined;
      },
      login: (context: AuthenticationContext) => {
        set({ context });
      },
      logout: () => {
        set({ context: undefined });
      },
    };
  }
);

export const useAuthStore = () => {
  return useStore(AuthenticationStore);
};

/**
 * localStorage에 인증 정보를 저장합니다.
 * @param mapper 인증 정보를 변환하는 함수
 */
const updateStoredContext = (
  mapper: (
    context: AuthenticationContext | undefined
  ) => AuthenticationContext | undefined
) => {
  const current = loadStoredContext();
  const updated = mapper(current);

  localStorage.setItem("authContext", updated ? JSON.stringify(updated) : "");
};

AuthenticationStore.subscribe((state) => {
  updateStoredContext(() => state.context);
});
