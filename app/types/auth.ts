export interface User {
  id: string;
  email: string;
  fullname: string;
  gender: string;
  role: "USER" | "ADMIN" | "EMPLOYEE";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullname: string;
  gender: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // biometricEnabled: boolean;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN" | "EMPLOYEE";
  iat: number;
  exp: number;
}
