import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { SplashScreen } from "../components/SplashScreen";
import { LoginScreen } from "../components/LoginScreen";
import { SignupScreen } from "../components/SignupScreen";
import { UserHomeScreen } from "../components/UserHomeScreen";
import { EmployeeHomeScreen } from "../components/EmployeeHomeScreen";
import { AdminHomeScreen } from "../components/AdminHomeScreen";

export function AppNavigator() {
  const { state } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<"login" | "signup">(
    "login"
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  if (!state.isAuthenticated) {
    if (currentScreen === "signup") {
      return <SignupScreen onSwitchToLogin={() => setCurrentScreen("login")} />;
    }

    return <LoginScreen onSwitchToSignup={() => setCurrentScreen("signup")} />;
  }

  switch (state.user?.role) {
    case "ADMIN":
      return <AdminHomeScreen />;
    case "EMPLOYEE":
      return <EmployeeHomeScreen />;
    case "USER":
    default:
      return <UserHomeScreen />;
  }
}
