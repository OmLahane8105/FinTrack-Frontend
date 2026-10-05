import { createContext } from "react";

import type {
  AuthUser,
  LoginResponse,
} from "../types";

export interface AuthContextType {

  user: AuthUser | null;

  isAuthenticated: boolean;

  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  loginWithOAuth: (
    response: LoginResponse
  ) => void;

  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function createAuthUser(
  response: LoginResponse
): AuthUser {

  return {
    id: response.userId,
    name: response.name,
    email: response.email,
    role: response.role,
  };
}