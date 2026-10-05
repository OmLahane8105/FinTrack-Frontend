import {
  useCallback,
  useState,
  type ReactNode,
} from "react";

import {
  loginApi,
  logoutApi,
} from "../api/authApi";

import type {
  AuthUser,
  LoginResponse,
} from "../types";

import {
  AuthContext,
  createAuthUser,
} from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [user, setUser] =
    useState<AuthUser | null>(() => {

      const accessToken =
        localStorage.getItem("accessToken");

      const storedUser =
        localStorage.getItem("authUser");

      if (
        !accessToken ||
        !storedUser
      ) {
        return null;
      }

      try {
        return JSON.parse(
          storedUser
        ) as AuthUser;

      } catch {
        localStorage.removeItem(
          "authUser"
        );

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        return null;
      }
    });

  const saveSession = useCallback(
    (response: LoginResponse) => {

      localStorage.setItem(
        "accessToken",
        response.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        response.refreshToken
      );

      const authUser =
        createAuthUser(response);

      localStorage.setItem(
        "authUser",
        JSON.stringify(authUser)
      );

      setUser(authUser);
    },
    []
  );

  const loginWithOAuth = useCallback(
    (response: LoginResponse) => {
      saveSession(response);
    },
    [saveSession]
  );

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<void> => {

      const response =
        await loginApi({
          email,
          password,
        });

      saveSession(response);
    },
    [saveSession]
  );

  const logout = useCallback(
    async (): Promise<void> => {

      const refreshToken =
        localStorage.getItem(
          "refreshToken"
        );

      try {

        if (refreshToken) {
          await logoutApi(refreshToken);
        }

      } catch (error) {

        console.error(
          "Logout API failed:",
          error
        );
      }

      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "authUser"
      );

      setUser(null);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading: false,
        login,
        loginWithOAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}