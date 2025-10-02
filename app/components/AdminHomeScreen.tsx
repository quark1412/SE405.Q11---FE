import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { ProfileScreen } from "./ProfileScreen";
import { UserListScreen } from "./UserListScreen";
import { UserDetailScreen } from "./UserDetailScreen";
import { CreateUserScreen } from "./CreateUserScreen";
import { EditUserScreen } from "./EditUserScreen";
import Svg, { Path } from "react-native-svg";

const Tab = createBottomTabNavigator();

type Screen = "tabs" | "userDetail" | "createUser" | "editUser";

interface User {
  id: string;
  email: string;
  fullname: string;
  gender: string;
  role: string;
}

export function AdminHomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("tabs");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserPress = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentScreen("userDetail");
  };

  const handleCreateUser = () => {
    setCurrentScreen("createUser");
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setCurrentScreen("editUser");
  };

  const handleBackToUsers = () => {
    setCurrentScreen("tabs");
    setSelectedUserId(null);
    setSelectedUser(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleBackFromDetail = () => {
    setCurrentScreen("tabs");
    setSelectedUserId(null);
  };

  if (currentScreen === "userDetail" && selectedUserId) {
    return (
      <UserDetailScreen
        userId={selectedUserId}
        onBack={handleBackFromDetail}
        onEdit={handleEditUser}
        isAdmin={true}
      />
    );
  }

  if (currentScreen === "createUser") {
    return (
      <CreateUserScreen
        onBack={handleBackToUsers}
        onSuccess={handleBackToUsers}
      />
    );
  }

  if (currentScreen === "editUser" && selectedUser) {
    return (
      <EditUserScreen
        user={selectedUser}
        onBack={handleBackToUsers}
        onSuccess={handleBackToUsers}
      />
    );
  }

  return (
    <Tab.Navigator
      key={refreshKey}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#dc2626",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#e5e7eb",
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          // marginBottom: 10,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Users"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </Svg>
          ),
        }}
      >
        {() => (
          <UserListScreen
            onUserPress={handleUserPress}
            onCreateUser={handleCreateUser}
            isAdmin={true}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </Svg>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
