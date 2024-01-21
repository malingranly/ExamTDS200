import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import UploadPage from "../pages/UploadPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import WelcomePage from "../pages/WelcomePage";
import DetailsPage from "../pages/DetailsPage";
import Map from "../pages/Map";

const { Navigator, Screen } = createStackNavigator();

const HomeStack: React.FC = () => (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
      <Screen name="UploadPage" component={UploadPage} options={{ headerShown: false }} />
      <Screen name="RegisterPage" component={RegisterPage} options={{ headerShown: false }} />
      <Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
      <Screen name="WelcomePage" component={WelcomePage} options={{ headerShown: false }} />
      <Screen name="DetailsPage" component={DetailsPage} options={{ headerShown: false }} />
      <Screen name="Map" component={Map} options={{ headerShown: false }} />
    </Navigator>
  );
  

export default HomeStack;
