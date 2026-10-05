import { useEffect } from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import type {
  AuthUser,
  LoginResponse,
  UserRole,
} from "../types";

import { useAuth } from "../context/useAuth";

export default function OAuth2Callback() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const { loginWithOAuth } =
    useAuth();

  const accessToken =
    searchParams.get("accessToken");

  const refreshToken =
    searchParams.get("refreshToken");

  const expiresInParam =
    searchParams.get("expiresIn");

  const userId =
    searchParams.get("userId");

  const name =
    searchParams.get("name");

  const email =
    searchParams.get("email");

  const role =
    searchParams.get("role");

  const expiresIn =
    expiresInParam
      ? Number(expiresInParam)
      : 0;

  const isValidRole =
    role === "USER" ||
    role === "ADMIN";

  const isValidUserId =
    userId !== null &&
    Number.isInteger(Number(userId)) &&
    Number(userId) > 0;

  const hasValidResponse =
    !!accessToken &&
    !!refreshToken &&
    !!userId &&
    !!name &&
    !!email &&
    isValidRole &&
    isValidUserId &&
    Number.isFinite(expiresIn) &&
    expiresIn > 0;

  useEffect(() => {

    if (!hasValidResponse) {
      return;
    }

    const user: AuthUser = {
      id: Number(userId),
      name: name!,
      email: email!,
      role: role as UserRole,
    };

    const response: LoginResponse = {
      accessToken: accessToken!,
      refreshToken: refreshToken!,
      tokenType: "Bearer",
      expiresIn,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    loginWithOAuth(response);

    navigate(
      "/dashboard",
      {
        replace: true,
      }
    );

  }, [
    hasValidResponse,
    accessToken,
    refreshToken,
    expiresIn,
    userId,
    name,
    email,
    role,
    loginWithOAuth,
    navigate,
  ]);

  if (!hasValidResponse) {

    return (
      <main className="container">

        <div className="error-message">
          Google login response was incomplete.
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
        >
          Back to Login
        </button>

      </main>
    );
  }

  return (
    <main className="container">

      <p>
        Completing Google login...
      </p>

    </main>
  );
}