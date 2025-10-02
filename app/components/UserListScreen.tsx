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
}

interface UserListScreenProps {
  onUserPress: (userId: string) => void;
  onCreateUser?: () => void;
  isAdmin?: boolean;
}

export function UserListScreen({
  onUserPress,
  onCreateUser,
  isAdmin = false,
}: UserListScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUsers({
        page,
        limit: 10,
        search,
        role: selectedRole,
      });

      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search, selectedRole]);

  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  const handleRoleFilter = (role: string | undefined) => {
    setSelectedRole(role);
    setPage(1);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "EMPLOYEE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-gray-900">Users</Text>
          {isAdmin && onCreateUser && (
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-lg"
              onPress={onCreateUser}
            >
              <Text className="text-white font-medium">+ Create User</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <TextInput
          className="bg-gray-100 px-4 py-2 rounded-lg mb-3"
          placeholder="Search by name or email..."
          value={search}
          onChangeText={handleSearch}
        />

        {/* Role Filter */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`px-3 py-1 rounded-full ${
              selectedRole === undefined ? "bg-blue-600" : "bg-gray-200"
            }`}
            onPress={() => handleRoleFilter(undefined)}
          >
            <Text
              className={
                selectedRole === undefined ? "text-white" : "text-gray-700"
              }
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-3 py-1 rounded-full ${
              selectedRole === "USER" ? "bg-blue-600" : "bg-gray-200"
            }`}
            onPress={() => handleRoleFilter("USER")}
          >
            <Text
              className={
                selectedRole === "USER" ? "text-white" : "text-gray-700"
              }
            >
              Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-3 py-1 rounded-full ${
              selectedRole === "EMPLOYEE" ? "bg-blue-600" : "bg-gray-200"
            }`}
            onPress={() => handleRoleFilter("EMPLOYEE")}
          >
            <Text
              className={
                selectedRole === "EMPLOYEE" ? "text-white" : "text-gray-700"
              }
            >
              Employees
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-3 py-1 rounded-full ${
              selectedRole === "ADMIN" ? "bg-blue-600" : "bg-gray-200"
            }`}
            onPress={() => handleRoleFilter("ADMIN")}
          >
            <Text
              className={
                selectedRole === "ADMIN" ? "text-white" : "text-gray-700"
              }
            >
              Admins
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView className="flex-1">
          <View className="p-4 gap-3">
            {users.map((user) => (
              <TouchableOpacity
                key={user.id}
                className="bg-white rounded-lg p-4 shadow-sm"
                onPress={() => onUserPress(user.id)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {user.fullname}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-1">
                      {user.email}
                    </Text>
                    <Text className="text-gray-500 text-xs">{user.gender}</Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${getRoleColor(
                      user.role
                    )}`}
                  >
                    <Text className="text-xs font-medium">{user.role}</Text>
                  </View>
                </View>
                <Text className="text-gray-400 text-xs">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pagination */}
          <View className="flex-row justify-between items-center p-4">
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                page === 1 ? "bg-gray-200" : "bg-blue-600"
              }`}
              onPress={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <Text className={page === 1 ? "text-gray-400" : "text-white"}>
                Previous
              </Text>
            </TouchableOpacity>

            <Text className="text-gray-700">
              Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                page === totalPages ? "bg-gray-200" : "bg-blue-600"
              }`}
              onPress={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <Text
                className={page === totalPages ? "text-gray-400" : "text-white"}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
