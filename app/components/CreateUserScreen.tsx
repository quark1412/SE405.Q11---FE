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
import { ApiService } from "../services/api.service";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateUserScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateUserScreen({ onBack, onSuccess }: CreateUserScreenProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("MALE");
  const [role, setRole] = useState("USER");
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateUser = async () => {
    if (!email.trim() || !fullname.trim() || !password.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await ApiService.createUser({
        email: email.trim(),
        fullname: fullname.trim(),
        password,
        gender,
        role,
      });

      Alert.alert("Success", "User created successfully");
      onSuccess();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (roleValue: string) => {
    switch (roleValue) {
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
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} className="">
            <Text className="text-blue-600 text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl text-center font-bold text-gray-900 flex-1">
            Create New User
          </Text>
        </View>
      </View>

      {/* Form */}
      <View className="p-6">
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          {/* Email */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Email *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Full Name *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter full name"
              value={fullname}
              onChangeText={setFullname}
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Password *</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg">
              <TextInput
                className="flex-1 px-4 py-3 text-gray-900"
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                className="px-4"
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Text className="text-blue-600 font-medium">
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Gender */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Gender *</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg px-4 py-3"
              onPress={() => setShowGenderModal(true)}
              disabled={loading}
            >
              <Text className="text-gray-900">{gender}</Text>
            </TouchableOpacity>
          </View>

          {/* Role */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Role *</Text>
            <TouchableOpacity
              className={`rounded-lg px-4 border border-gray-300 py-3`}
              onPress={() => setShowRoleModal(true)}
              disabled={loading}
            >
              <Text className="">{role}</Text>
            </TouchableOpacity>
          </View>

          {/* Create Button */}
        </View>
        <TouchableOpacity
          className={`py-4 rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
          onPress={handleCreateUser}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Create User
            </Text>
          )}
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

      {/* Role Selection Modal */}
      <Modal
        visible={showRoleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-lg p-6 m-6 w-80">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Select Role
            </Text>
            <TouchableOpacity
              className={`py-3 px-4 rounded-lg mb-2 ${
                role === "USER" ? "bg-blue-600" : "bg-gray-100"
              }`}
              onPress={() => {
                setRole("USER");
                setShowRoleModal(false);
              }}
            >
              <Text
                className={`text-center font-medium ${
                  role === "USER" ? "text-white" : "text-gray-900"
                }`}
              >
                USER
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-3 px-4 rounded-lg mb-2 ${
                role === "EMPLOYEE" ? "bg-green-600" : "bg-gray-100"
              }`}
              onPress={() => {
                setRole("EMPLOYEE");
                setShowRoleModal(false);
              }}
            >
              <Text
                className={`text-center font-medium ${
                  role === "EMPLOYEE" ? "text-white" : "text-gray-900"
                }`}
              >
                EMPLOYEE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-3 px-4 rounded-lg mb-4 ${
                role === "ADMIN" ? "bg-red-600" : "bg-gray-100"
              }`}
              onPress={() => {
                setRole("ADMIN");
                setShowRoleModal(false);
              }}
            >
              <Text
                className={`text-center font-medium ${
                  role === "ADMIN" ? "text-white" : "text-gray-900"
                }`}
              >
                ADMIN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-2"
              onPress={() => setShowRoleModal(false)}
            >
              <Text className="text-center text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
