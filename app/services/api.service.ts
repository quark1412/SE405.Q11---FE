import { jwtDecode } from "jwt-decode";
import {
  LoginRequest,
  SignupRequest,
  LoginResponse,
  JWTPayload,
  User,
} from "../types/auth";
import { StorageService } from "./storage.service";
import apiInstance from "../config/api.config";
import { AxiosError } from "axios";

export class ApiService {
  // Login
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiInstance.post("/auth/login", credentials, {
        requiresAuth: false,
      } as any);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  }

  // Signup
  static async signup(userData: SignupRequest): Promise<User> {
    try {
      const response = await apiInstance.post("/auth/signup", userData, {
        requiresAuth: false,
      } as any);

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Signup failed");
      }
      throw error;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      const refreshToken = await StorageService.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await apiInstance.post("/auth/logout", { refreshToken });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Logout failed");
      }
      throw error;
    }
  }

  // Refresh token
  static async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = await StorageService.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await apiInstance.post("/auth/refresh-token", {
        refreshToken,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Token refresh failed"
        );
      }
      throw error;
    }
  }

  // Get current user profile
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiInstance.get("/users/profile");

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to get user profile"
        );
      }
      throw error;
    }
  }

  // Update current user profile
  static async updateProfile(data: {
    fullname: string;
    gender: string;
  }): Promise<{ data: User; message: string }> {
    try {
      const response = await apiInstance.put("/users/profile", data);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to update profile"
        );
      }
      throw error;
    }
  }

  // Get all users (Admin/Employee only)
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    data: User[];
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.role) queryParams.append("role", params.role);

      const response = await apiInstance.get(
        `/users?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to get users");
      }
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<{ data: User }> {
    try {
      const response = await apiInstance.get(`/users/${userId}`);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to get user");
      }
      throw error;
    }
  }

  // Create user
  static async createUser(data: {
    email: string;
    fullname: string;
    password: string;
    gender: string;
    role: string;
  }): Promise<{ data: User; message: string }> {
    try {
      const response = await apiInstance.post("/users", data);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to create user"
        );
      }
      throw error;
    }
  }

  // Update user by ID (Admin only)
  static async updateUserById(
    userId: string,
    data: {
      fullname: string;
      gender: string;
      role: string;
      password?: string;
    }
  ): Promise<{ data: User; message: string }> {
    try {
      const response = await apiInstance.put(`/users/${userId}`, data);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to update user"
        );
      }
      throw error;
    }
  }

  // Decode JWT token
  static decodeToken(token: string): JWTPayload {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.log("Token decode error:", error);
      throw new Error("Invalid token");
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  static async apiCall<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any,
    requiresAuth: boolean = true
  ): Promise<T> {
    try {
      const config = { requiresAuth } as any;

      let response;
      switch (method) {
        case "GET":
          response = await apiInstance.get(endpoint, config);
          break;
        case "POST":
          response = await apiInstance.post(endpoint, data, config);
          break;
        case "PUT":
          response = await apiInstance.put(endpoint, data, config);
          break;
        case "DELETE":
          response = await apiInstance.delete(endpoint, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || `${method} request failed`
        );
      }
      throw error;
    }
  }
}
