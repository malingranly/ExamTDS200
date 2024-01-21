import React from "react";
import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import WelcomeRoutes from "./src/routes/WelcomeRoutes";
import { fbApp } from "./firebase-config";
import { PostProvider } from "/Users/malingranly/Documents/travelSnap/src/PostContext/index";

export default function App() {
  console.log(fbApp)
  return (
    <NavigationContainer>
      <PostProvider>
        <WelcomeRoutes />
      </PostProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
