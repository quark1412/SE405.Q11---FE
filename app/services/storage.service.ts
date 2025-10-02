import * as SecureStore from "expo-secure-store";

const TOKENS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
};

export class StorageService {
  // Token management
  static async storeTokens(
    accessToken: string,
    refreshToken: string
  ): Promise<void> {
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKENS.ACCESS_TOKEN, accessToken),
        SecureStore.setItemAsync(TOKENS.REFRESH_TOKEN, refreshToken),
        SecureStore.setItemAsync("biometric_enabled", "true"),
      ]);
    } catch (error) {
      console.log("Error storing tokens:", error);
      throw new Error("Failed to store tokens");
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKENS.ACCESS_TOKEN);
    } catch (error) {
      console.log("Error getting access token:", error);
      return null;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKENS.REFRESH_TOKEN);
    } catch (error) {
      console.log("Error getting refresh token:", error);
      return null;
    }
  }

  static async removeTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKENS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(TOKENS.REFRESH_TOKEN),
      ]);
    } catch (error) {
      console.log("Error removing tokens:", error);
    }
  }

  // User data management
  static async storeUserData(userData: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        TOKENS.USER_DATA,
        JSON.stringify(userData)
      );
    } catch (error) {
      console.log("Error storing user data:", error);
      throw new Error("Failed to store user data");
    }
  }

  static async getUserData(): Promise<any | null> {
    try {
      const userData = await SecureStore.getItemAsync(TOKENS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.log("Error getting user data:", error);
      return null;
    }
  }

  static async removeUserData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKENS.USER_DATA);
    } catch (error) {
      console.log("Error removing user data:", error);
    }
  }

  // Biometric flag management
  static async getBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync("biometric_enabled");
      return enabled === "true";
    } catch (error) {
      console.log("Error getting biometric flag:", error);
      return false;
    }
  }

  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        "biometric_enabled",
        enabled ? "true" : "false"
      );
    } catch (error) {
      console.log("Error setting biometric flag:", error);
    }
  }

  // Clear session conditionally based on biometric setting
  static async clearSession(): Promise<void> {
    try {
      const biometricEnabled = await this.getBiometricEnabled();
      
      if (biometricEnabled) {
        // Keep tokens and biometric flag for biometric re-authentication
        await this.removeUserData();
      } else {
        // Remove everything including tokens
        await Promise.all([
          this.removeTokens(),
          this.removeUserData(),
        ]);
      }
    } catch (error) {
      console.log("Error clearing session:", error);
    }
  }

  // Clear all stored data including tokens and biometric flag
  static async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.removeTokens(),
        this.removeUserData(),
        SecureStore.deleteItemAsync("biometric_enabled"),
      ]);
    } catch (error) {
      console.log("Error clearing all data:", error);
    }
  }
}
