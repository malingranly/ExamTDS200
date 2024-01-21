import { useNavigation, NavigationProp } from "@react-navigation/native";

/// Type for the routing.
type RouteList = {
  Welcome: undefined;
  HomeStack: undefined;
  RegisterPage: undefined;
  LoginPage: undefined;
  
};

/// Type
type NavigationProps = NavigationProp<RouteList>;

const useOwnNavigation = () => {
  // Variables
  const navigation = useNavigation<NavigationProps>();
  const navigate = (path: keyof RouteList) => {
    navigation.navigate(path);
  };
  const goBack = () => {
    navigation.goBack();
  };

  return { navigate, goBack };
};

export default useOwnNavigation;

