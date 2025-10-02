import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { ApiService } from "../services/api.service";
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileScreen() {
  const { state, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState(state.user?.fullname || "");
  const [gender, setGender] = useState(state.user?.gender || "MALE");
  const [showGenderModal, setShowGenderModal] = useState(false);

  const handleUpdateProfile = async () => {
    if (!fullname.trim()) {
      Alert.alert("Error", "Full name is required");
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.updateProfile({
        fullname: fullname.trim(),
        gender,
      });

      // Update user in context
      if (state.user) {
        updateUser({
          ...state.user,
          fullname: response.data.fullname,
          gender: response.data.gender,
        });
      }

      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to logout");
          }
        },
      },
    ]);
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-600";
      case "EMPLOYEE":
        return "bg-green-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Header */}
        <View className={`${getRoleColor(state.user?.role)} pt-12 pb-6 px-6`}>
          <View className="items-center">
            <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4">
              <Text className="text-4xl font-bold text-gray-900">
                {state.user?.fullname?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-white text-2xl font-bold mb-2">
              {state.user?.fullname}
            </Text>
            <Text className="text-white/90">{state.user?.role}</Text>
          </View>
        </View>

        {/* Profile Content */}
        <View className="p-6">
          {/* Edit/View Mode */}
          <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Profile Information
              </Text>
              {!isEditing ? (
                <TouchableOpacity
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                  onPress={() => setIsEditing(true)}
                >
                  <Text className="text-white font-medium">Edit</Text>
                </TouchableOpacity>
              ) : (
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="bg-gray-300 px-4 py-2 rounded-lg"
                    onPress={() => {
                      setIsEditing(false);
                      setFullname(state.user?.fullname || "");
                      setGender(state.user?.gender || "MALE");
                    }}
                    disabled={loading}
                  >
                    <Text className="text-gray-700 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                    onPress={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text className="text-white font-medium">Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Email (Read-only) */}
            <View className="mb-4">
              <Text className="text-gray-500 text-sm mb-1">Email</Text>
              <Text className="text-gray-900 text-base bg-gray-100 px-4 py-3 rounded-lg">
                {state.user?.email}
              </Text>
            </View>

            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-gray-500 text-sm mb-1">Full Name</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  value={fullname}
                  onChangeText={setFullname}
                  placeholder="Enter your full name"
                  editable={!loading}
                />
              ) : (
                <Text className="text-gray-900 text-base bg-gray-100 px-4 py-3 rounded-lg">
                  {state.user?.fullname}
                </Text>
              )}
            </View>

            {/* Gender */}
            <View className="mb-4">
              <Text className="text-gray-500 text-sm mb-1">Gender</Text>
              {isEditing ? (
                <TouchableOpacity
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  onPress={() => setShowGenderModal(true)}
                  disabled={loading}
                >
                  <Text className="text-gray-900">{gender}</Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-gray-900 text-base bg-gray-100 px-4 py-3 rounded-lg">
                  {state.user?.gender}
                </Text>
              )}
            </View>

            {/* Role */}
            <View>
              <Text className="text-gray-500 text-sm mb-1">Role</Text>
              <View className={`border border-gray-300 px-4 py-3 rounded-lg`}>
                <Text className="">{state.user?.role}</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-600 py-4 rounded-lg"
            onPress={handleLogout}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Gender Selection Modal */}
        <Modal
          visible={showGenderModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-lg p-6 m-6 w-80">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Select Gender
              </Text>
              <TouchableOpacity
                className={`py-3 px-4 rounded-lg mb-2 ${
                  gender === "MALE" ? "bg-blue-600" : "bg-gray-100"
                }`}
                onPress={() => {
                  setGender("MALE");
                  setShowGenderModal(false);
                }}
              >
                <Text
                  className={`text-center font-medium ${
                    gender === "MALE" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-3 px-4 rounded-lg mb-2 ${
                  gender === "FEMALE" ? "bg-blue-600" : "bg-gray-100"
                }`}
                onPress={() => {
                  setGender("FEMALE");
                  setShowGenderModal(false);
                }}
              >
                <Text
                  className={`text-center font-medium ${
                    gender === "FEMALE" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-3 px-4 rounded-lg mb-4 ${
                  gender === "OTHER" ? "bg-blue-600" : "bg-gray-100"
                }`}
                onPress={() => {
                  setGender("OTHER");
                  setShowGenderModal(false);
                }}
              >
                <Text
                  className={`text-center font-medium ${
                    gender === "OTHER" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Other
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2"
                onPress={() => setShowGenderModal(false)}
              >
                <Text className="text-center text-gray-600">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
