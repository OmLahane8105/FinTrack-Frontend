import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { verifyEmailApi } from "../api/authApi";

type VerificationStatus =
  | "verifying"
  | "success"
  | "error";

export default function VerifyEmail() {
  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  const verificationStarted =
    useRef(false);

  const [status, setStatus] =
    useState<VerificationStatus>(
      token
        ? "verifying"
        : "error"
    );

  const [message, setMessage] =
    useState(
      token
        ? "Verifying your email address..."
        : "Invalid verification link."
    );

  useEffect(() => {
    if (!token) {
      return;
    }

    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    let cancelled = false;

    const verify = async () => {
      try {
        await verifyEmailApi(token);

        if (cancelled) {
          return;
        }

        setStatus("success");

        setMessage(
          "Your email has been verified successfully. You can now log in to FinTrack."
        );

      } catch (error: unknown) {

        if (cancelled) {
          return;
        }

        console.error(
          "Email verification failed:",
          error
        );

        const apiMessage =
          axios.isAxiosError(error)
            ? error.response?.data?.message
            : undefined;

        setStatus("error");

        setMessage(
          apiMessage ||
            "This verification link is invalid or has expired."
        );
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card verification-card">

        <h1>FinTrack</h1>

        <h2>
          {status === "verifying"
            ? "Verifying Email"
            : status === "success"
              ? "Email Verified"
              : "Verification Failed"}
        </h2>

        {status === "verifying" && (
          <div className="verification-loading">
            <div className="verification-spinner" />

            <p>{message}</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="success-message">
              {message}
            </div>

            <Link
              to="/login"
              className="primary-button verification-button"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="error-message">
              {message}
            </div>

            <Link
              to="/login"
              className="primary-button verification-button"
            >
              Go to Login
            </Link>

            <p className="auth-link">
              Need another verification email?{" "}
              <Link to="/register">
                Register again
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
}