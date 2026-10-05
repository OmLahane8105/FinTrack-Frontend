import api from "./api";

import type {
  LoginResponse,
} from "../types";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const loginApi = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const response =
    await api.post<LoginResponse>(
      "/api/auth/login",
      request
    );

  return response.data;
};

export const registerApi = async (
  request: RegisterRequest
) => {
  const response =
    await api.post(
      "/api/auth/register",
      request
    );

  return response.data;
};

export const logoutApi = async (
  refreshToken: string
): Promise<void> => {
  await api.post(
    "/api/auth/logout",
    {
      refreshToken,
    }
  );
};

export const getGoogleOAuthUrl = (): string => {
  return `${API_URL}/oauth2/authorization/google`;
};