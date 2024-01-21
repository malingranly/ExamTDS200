import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomePage from "../pages/WelcomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomeStack from "./HomeStack";
import HomeRoutes from "./HomeRoutes";
import DetailsPage from "../pages/DetailsPage";
import Map from "../pages/Map";

const { Navigator, Screen } = createStackNavigator();

const WelcomeRoutes: React.FC = () => {
  const noHeader = { headerShown: false };
  return (
    <Navigator initialRouteName="Welcome">
    <Screen name="Welcome" component={WelcomePage} options={noHeader} />
    <Screen name="HomeRoutes" component={HomeRoutes} options={noHeader} />
    <Screen name="RegisterPage" component={RegisterPage} options={noHeader} />
    <Screen name="LoginPage" component={LoginPage} options={noHeader} />
    <Screen name="DetailsPage" component={DetailsPage} options={noHeader} />
    <Screen name="Map" component={Map} options={{ headerShown: false }} />
  </Navigator>
  );
};

export default WelcomeRoutes;
