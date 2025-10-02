import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./contexts/AuthContext";
import { AppNavigator } from "./navigation/AppNavigator";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </AuthProvider>
  );
}
