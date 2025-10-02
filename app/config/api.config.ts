import axios, { InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

// Get base URL from environment or use default
const baseURL =
  process.env.EXPO_PUBLIC_BASE_URL ||
  (__DEV__
    ? "http://localhost:3000/api"
    : "https://your-production-api.com/api");

// Create axios instance
const apiInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Custom interface for request config
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
}

// Request interceptor with automatic token refresh
apiInstance.interceptors.request.use(
  async (
    req: CustomAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const refreshToken = await SecureStore.getItemAsync("refresh_token");

      const requiresAuth = req.requiresAuth !== false;

      if (!requiresAuth) {
        return req;
      }

      if (!req.headers) {
        req.headers = axios.AxiosHeaders.from(req.headers || {});
      }

      if (accessToken) {
        try {
          const user: { exp: number } = jwtDecode(accessToken);
          const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

          if (!isExpired) {
            req.headers.Authorization = `Bearer ${accessToken}`;
            return req;
          }
        } catch (err) {
          console.warn("Invalid token:", err);
        }
      }

      // Token is expired or invalid, try to refresh
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          await SecureStore.setItemAsync("access_token", newAccessToken);
          await SecureStore.setItemAsync("refresh_token", newRefreshToken);

          req.headers.Authorization = `Bearer ${newAccessToken}`;
          return req;
        } catch (err) {
          await SecureStore.deleteItemAsync("access_token");
          await SecureStore.deleteItemAsync("refresh_token");
          return req;
        }
      }

      return req;
    } catch (error) {
      return req;
    }
  }
);

// Response interceptor for error handling
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("API Response Error:", error);

    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      await SecureStore.deleteItemAsync("user_data");
      await SecureStore.deleteItemAsync("biometric_enabled");
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
