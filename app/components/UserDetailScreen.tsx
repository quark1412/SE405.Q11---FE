import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { ApiService } from "../services/api.service";
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
  id: string;
  email: string;
  fullname: string;
  gender: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailScreenProps {
  userId: string;
  onBack: () => void;
  onEdit?: (user: User) => void;
  isAdmin?: boolean;
}

export function UserDetailScreen({
  userId,
  onBack,
  onEdit,
  isAdmin = false,
}: UserDetailScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUserById(userId);
      setUser(response.data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load user details");
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "EMPLOYEE":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">User not found</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-600 px-6 py-2 rounded-lg"
          onPress={onBack}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <Text className="text-blue-600 text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 flex-1">
            User Details
          </Text>
          {isAdmin && onEdit && (
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-lg"
              onPress={() => onEdit(user)}
            >
              <Text className="text-white font-medium">Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* User Details */}
      <View className="p-4">
        {/* Profile Card */}
        <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-4xl font-bold">
                {user.fullname.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {user.fullname}
            </Text>
            <View className={`px-4 py-1 rounded-full border `}>
              <Text className="font-semibold">{user.role}</Text>
            </View>
          </View>

          {/* Information */}
          <View className="gap-4">
            <View>
              <Text className="text-gray-500 mb-1">Email</Text>
              <TextInput
                value={user.email}
                editable={false}
                className="border py-2 px-4 border-gray-300 rounded-md"
              />
            </View>

            <View>
              <Text className="text-gray-500 mb-1">Gender</Text>
              <TextInput
                value={user.gender}
                editable={false}
                className="border py-2 px-4 border-gray-300 rounded-md"
              />
            </View>

            <View>
              <Text className="text-gray-500 mb-1">User ID</Text>
              <TextInput
                value={user.id}
                editable={false}
                className="border py-2 px-4 border-gray-300 rounded-md"
              />
            </View>

            <View>
              <Text className="text-gray-500 mb-1">Account Created</Text>
              <TextInput
                value={new Date(user.createdAt).toLocaleString()}
                editable={false}
                className="border py-2 px-4 border-gray-300 rounded-md"
              />
            </View>

            <View>
              <Text className="text-gray-500 mb-1">Last Updated</Text>
              <TextInput
                value={new Date(user.updatedAt).toLocaleString()}
                editable={false}
                className="border py-2 px-4 border-gray-300 rounded-md"
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
