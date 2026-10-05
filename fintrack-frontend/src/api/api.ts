import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryRequestConfig =
  InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

let refreshPromise: Promise<string> | null = null;

const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
};

const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    const refreshToken =
      localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    refreshPromise = axios
      .post<RefreshTokenResponse>(
        `${API_URL}/api/auth/refresh`,
        {
          refreshToken,
        }
      )
      .then((response) => {
        const {
          accessToken,
          refreshToken: newRefreshToken,
        } = response.data;

        /*
         * The backend rotates BOTH tokens.
         */
        localStorage.setItem(
          "accessToken",
          accessToken
        );

        localStorage.setItem(
          "refreshToken",
          newRefreshToken
        );

        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

/*
 * Attach the current access token to every API request.
 */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
 * Automatically refresh the access token when
 * the backend responds with 401.
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryRequestConfig | undefined;

    /*
     * Only refresh for an unauthorized request
     * that has not already been retried.
     */
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken =
      localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearSession();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    try {
      /*
       * If several requests fail at the same time,
       * they all wait for the same refresh request.
       */
      const newAccessToken =
        await refreshAccessToken();

      /*
       * Retry the original request with the
       * newly generated access token.
       */
      if (originalRequest.headers) {
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);

    } catch (refreshError) {

      /*
       * Refresh failed:
       * the refresh token is expired, revoked,
       * invalid, or the session is otherwise invalid.
       */
      clearSession();

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  }
);

export default api;