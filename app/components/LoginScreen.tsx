import React, { useEffect, useState } from "react";
import { Svg, Path } from "react-native-svg";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import * as LocalAuthentication from "expo-local-authentication";
import { StorageService } from "../services/storage.service";

interface LoginScreenProps {
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onSwitchToSignup }: LoginScreenProps) {
  const { login, state, initializeAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [canUseBiometric, setCanUseBiometric] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const biometricEnabled = await StorageService.getBiometricEnabled();
      const hasTokens =
        (await StorageService.getAccessToken()) !== null &&
        (await StorageService.getRefreshToken()) !== null;

      const available = hasHardware && isEnrolled;
      setBiometricAvailable(available);
      setCanUseBiometric(available && biometricEnabled && hasTokens);
    };
    checkBiometrics();
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    try {
      await login({ email: email.trim(), password });
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    }
  };

  const handleBiometricLogin = async () => {
    try {
      // Check if biometric is available and tokens exist
      const biometricEnabled = await StorageService.getBiometricEnabled();
      const hasTokens =
        (await StorageService.getAccessToken()) !== null &&
        (await StorageService.getRefreshToken()) !== null;

      if (!biometricEnabled || !hasTokens) {
        Alert.alert(
          "Biometric Login Unavailable",
          "Please login with your email and password first to enable biometric authentication."
        );
        return;
      }

      // Authenticate with biometric
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to login",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
        fallbackLabel: "Use password",
      });

      if (result.success) {
        await initializeAuth();
      } else {
        Alert.alert(
          "Authentication Failed",
          "Biometric authentication was not successful."
        );
      }
    } catch (error: any) {
      console.log("Biometric login error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to authenticate with biometric"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600 text-center">
              Sign in to your account
            </Text>
          </View>

          {/* Login Form */}
          <View className="gap-4">
            {/* Email Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!state.isLoading}
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg">
                <TextInput
                  className="flex-1 px-4 py-3 text-gray-900"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  editable={!state.isLoading}
                />
                <TouchableOpacity
                  className="px-4"
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={state.isLoading}
                >
                  <Text className="text-blue-600 font-medium">
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <View className="flex mt-4 gap-4 flex-row items-center w-full">
              <TouchableOpacity
                className={`py-4 flex-1 rounded-lg ${
                  state.isLoading ? "bg-gray-400" : "bg-blue-600"
                }`}
                onPress={handleLogin}
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>
              {canUseBiometric && (
                <TouchableOpacity
                  className={`p-4 rounded-lg ${
                    state.isLoading ? "bg-gray-400" : "bg-blue-600"
                  }`}
                  onPress={handleBiometricLogin}
                  disabled={state.isLoading}
                >
                  <Svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={1.5}
                    className="w-6 h-6"
                  >
                    <Path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
                    />
                  </Svg>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Footer */}
          <View className="mt-4">
            <TouchableOpacity
              onPress={onSwitchToSignup}
              disabled={state.isLoading}
            >
              <Text className="text-center text-gray-600">
                Don't have an account?{" "}
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
