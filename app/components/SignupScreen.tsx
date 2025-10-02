import React, { useState } from "react";
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
  Modal,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

interface SignupScreenProps {
  onSwitchToLogin: () => void;
}

export function SignupScreen({ onSwitchToLogin }: SignupScreenProps) {
  const { signup, state } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const handleSignup = async () => {
    // Validation
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!formData.fullname.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    if (!formData.password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!formData.gender) {
      Alert.alert("Error", "Please select your gender");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      await signup({
        email: formData.email.trim(),
        password: formData.password,
        fullname: formData.fullname.trim(),
        gender: formData.gender,
      });

      Alert.alert("Success", "Account created successfully! Please sign in.", [
        { text: "OK", onPress: onSwitchToLogin },
      ]);
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "Failed to create account");
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600 text-center">
              Sign up to get started
            </Text>
          </View>

          {/* Signup Form */}
          <View className="space-y-4">
            {/* Full Name Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChangeText={(value) => updateFormData("fullname", value)}
                autoComplete="name"
                editable={!state.isLoading}
              />
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!state.isLoading}
              />
            </View>

            {/* Gender Picker */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Gender</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg px-4 py-3"
                onPress={() => setShowGenderModal(true)}
                disabled={state.isLoading}
              >
                <Text
                  className={
                    formData.gender ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {formData.gender
                    ? genderOptions.find(
                        (option) => option.value === formData.gender
                      )?.label
                    : "Select Gender"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg">
                <TextInput
                  className="flex-1 px-4 py-3 text-gray-900"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => updateFormData("password", value)}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
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

            {/* Confirm Password Input */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">
                Confirm Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg">
                <TextInput
                  className="flex-1 px-4 py-3 text-gray-900"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    updateFormData("confirmPassword", value)
                  }
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                  editable={!state.isLoading}
                />
                <TouchableOpacity
                  className="px-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={state.isLoading}
                >
                  <Text className="text-blue-600 font-medium">
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg mt-6 ${
                state.isLoading ? "bg-gray-400" : "bg-blue-600"
              }`}
              onPress={handleSignup}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8">
            <TouchableOpacity
              onPress={onSwitchToLogin}
              disabled={state.isLoading}
            >
              <Text className="text-center text-gray-600">
                Already have an account?{" "}
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-gray-900 mb-4 text-center">
              Select Gender
            </Text>

            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="py-4 border-b border-gray-200"
                onPress={() => {
                  updateFormData("gender", option.value);
                  setShowGenderModal(false);
                }}
              >
                <Text className="text-lg text-gray-900 text-center">
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="py-4 mt-4"
              onPress={() => setShowGenderModal(false)}
            >
              <Text className="text-lg text-blue-600 text-center font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
