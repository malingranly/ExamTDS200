import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomePage from "../pages/HomePage";
import UploadPage from "../pages/UploadPage";
import ProfilePage from "../pages/ProfilePage";

/// Variables
const { Navigator: TabNavigator, Screen: TabScreen } = createBottomTabNavigator();
const pinkColor = "#d81b60";
const blackColor = "#000";

const HomeRoutes: React.FC = () => {
  return (
    <TabNavigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { color: blackColor },
        tabBarActiveTintColor: pinkColor,
        tabBarInactiveTintColor: pinkColor,
        tabBarIconStyle: { color: pinkColor },
        
      }}
    >
      <TabScreen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <TabScreen
        name="UploadPage"
        component={UploadPage}
        options={{
          tabBarLabel: 'Upload',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cloud-upload" color={color} size={size} />
          ),
        }}
      />
      <TabScreen
        name="ProfilePage"
        component={ProfilePage}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" color={color} size={size} />
          ),
        }}
      />
    </TabNavigator>
  );
};

export default HomeRoutes;
