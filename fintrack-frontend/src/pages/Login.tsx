import {
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "../context/useAuth";
import { getGoogleOAuthUrl } from "../api/authApi";

export default function Login() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const {
    login,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState(
      searchParams.get("error") || ""
    );

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      await login(
        email,
        password
      );

      navigate("/dashboard");

    } catch (error: unknown) {

      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message ||
        "Invalid email or password"
      );

    } finally {

      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {

    window.location.href =
      getGoogleOAuthUrl();
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>FinTrack</h1>

        <h2>Login</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
              required
            />

          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <div className="oauth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-login-button"
          onClick={handleGoogleLogin}
        >
          <svg
            className="google-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.92-4.18 2.92-7.42z"
            />

            <path
              fill="#34A853"
              d="M12 21.9c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.9z"
            />

            <path
              fill="#FBBC05"
              d="M6.54 13.99A5.86 5.86 0 0 1 6.23 12c0-.69.12-1.36.31-1.99V7.48H3.29A9.94 9.94 0 0 0 2.25 12c0 1.63.39 3.17 1.04 4.52l3.25-2.53z"
            />

            <path
              fill="#EA4335"
              d="M12 5.98c1.43 0 2.72.49 3.73 1.46l2.79-2.79C16.84 3.1 14.63 2.1 12 2.1a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53C7.31 7.7 9.46 5.98 12 5.98z"
            />
          </svg>

          <span className="google-button-text">
            Continue with Google
          </span>
        </button>

        <p className="auth-link">

          Don't have an account?

          {" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}