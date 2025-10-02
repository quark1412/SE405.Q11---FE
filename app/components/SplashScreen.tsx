import React from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export function SplashScreen() {
  const { state } = useAuth();

  return (
    <View className="flex-1 bg-blue-600 justify-center items-center">
      {/* App Logo/Icon */}
      <View className="mb-8">
        <View className="w-20 h-20 bg-white rounded-full justify-center items-center">
          <Text className="text-blue-600 text-2xl font-bold">A</Text>
        </View>
      </View>

      {/* App Name */}
      <Text className="text-white text-3xl font-bold mb-2">AuthDemo</Text>
      <Text className="text-white text-lg opacity-80 mb-8">
        Secure Authentication
      </Text>

      {/* Loading Indicator */}
      <ActivityIndicator size="large" color="white" />

      {/* Loading Text */}
      <Text className="text-white mt-4 opacity-80">
        {state.isLoading
          ? "Verifying identity..."
          : state.isLoading
            ? "Loading..."
            : "Initializing..."}
      </Text>
    </View>
  );
}
