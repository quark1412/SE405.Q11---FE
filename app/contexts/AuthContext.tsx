import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { AuthState, LoginRequest, SignupRequest, User } from "../types/auth";
import { ApiService } from "../services/api.service";
import { StorageService } from "../services/storage.service";

// Auth actions
type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_AUTHENTICATED";
      payload: { user: User; accessToken: string; refreshToken: string };
    }
  | { type: "SET_UNAUTHENTICATED" }
  | { type: "UPDATE_USER"; payload: User };

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_AUTHENTICATED":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case "SET_UNAUTHENTICATED":
      return {
        ...initialState,
        isLoading: false,
      };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// Auth context type
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const [accessToken, refreshToken] = await Promise.all([
        StorageService.getAccessToken(),
        StorageService.getRefreshToken(),
      ]);

      if (accessToken && refreshToken) {
        // Check if token is expired
        if (ApiService.isTokenExpired(accessToken)) {
          try {
            // Try to refresh token
            const newTokens = await ApiService.refreshToken();
            await StorageService.storeTokens(
              newTokens.accessToken,
              newTokens.refreshToken
            );

            // Get user data
            const user = await getUserFromToken(newTokens.accessToken);
            dispatch({
              type: "SET_AUTHENTICATED",
              payload: {
                user,
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
              },
            });
          } catch (error) {
            await StorageService.clearAll();
            dispatch({ type: "SET_UNAUTHENTICATED" });
          }
        } else {
          const user = await getUserFromToken(accessToken);
          dispatch({
            type: "SET_AUTHENTICATED",
            payload: { user, accessToken, refreshToken },
          });
        }
      } else {
        dispatch({ type: "SET_UNAUTHENTICATED" });
      }
    } catch (error) {
      console.log("Auth initialization error:", error);
      dispatch({ type: "SET_UNAUTHENTICATED" });
    }
  };

  // Get user data from token
  const getUserFromToken = async (token: string): Promise<User> => {
    try {
      const decoded = ApiService.decodeToken(token);

      try {
        return await ApiService.getCurrentUser();
      } catch (apiError) {
        return {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          fullname: "",
          gender: "",
          createdAt: "",
          updatedAt: "",
        };
      }
    } catch (error) {
      throw new Error("Invalid token");
    }
  };

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const tokens = await ApiService.login(credentials);
      await StorageService.storeTokens(tokens.accessToken, tokens.refreshToken);
      await StorageService.setBiometricEnabled(true);

      const user = await getUserFromToken(tokens.accessToken);
      await StorageService.storeUserData(user);

      dispatch({
        type: "SET_AUTHENTICATED",
        payload: {
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } catch (error: any) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  // Signup function
  const signup = async (userData: SignupRequest) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await ApiService.signup(userData);
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error: any) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        await ApiService.logout();
      } catch (error) {
        console.log(error);
      }

      await StorageService.clearSession();
      dispatch({ type: "SET_UNAUTHENTICATED" });
    } catch (error) {
      console.log("Logout error:", error);
      await StorageService.clearSession();
      dispatch({ type: "SET_UNAUTHENTICATED" });
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (state.isAuthenticated && state.accessToken) {
        const user = await ApiService.getCurrentUser();
        await StorageService.storeUserData(user);
        dispatch({ type: "UPDATE_USER", payload: user });
      }
    } catch (error) {
      console.log("Refresh user error:", error);
    }
  };

  // Update user in context
  const updateUser = (user: User) => {
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    initializeAuth,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
