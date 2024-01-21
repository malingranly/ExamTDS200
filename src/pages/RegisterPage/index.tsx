import React, { useState } from "react";
import { Text, View, TextInput, Button, Alert, TouchableHighlight } from "react-native";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import useOwnNavigation from "../../hooks/useOwnNavigation";
import { saveUserToFirestore } from "../../../firebase-config";

const RegisterPage: React.FC = () => {
  /// Variables and states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { navigate } = useOwnNavigation();
  const [username, setUserName] = useState<string>("");

  /* Navigation helper-function */
  const handleNav = () => {
    navigate("LoginPage")
  }

  /* Handling register of user, saving and authentication in Firestore Authentication */
  const handleRegister = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      /* Update user profile with username */
      await updateProfile(user, {
        displayName: username,
      });
  
      navigate("HomeRoutes" as never);
      Alert.alert("Registration Successful", `Welcome, ${user.displayName}`);
      await saveUserToFirestore(user.uid, user.email, username);
    } catch (e) {
      Alert.alert("Registration Failed", (e as Error).message);
    }
  };
  
  return (
    <View className="flex-1 justify-center items-center">
      
      <TextInput
        className="h-10 w-52 p-2 border-2 border-pink-500 mb-2 rounded-lg"
        placeholder="Username"
        onChangeText={(text) => setUserName(text)}
        value={username}
      />
      <TextInput
        className="h-10 w-52 p-2 border-2 border-pink-500 mb-2 rounded-lg"
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        className="h-10 w-52 p-2 border-2 border-pink-500 mb-2 rounded-lg"
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableHighlight underlayColor="transparent" onPress={handleRegister} >
        <Text className="text-lg text-pink-600">Register</Text>
      </TouchableHighlight>
      <View className="mt-4 flex-row align-center items-center">
        <Text className="text-lg">Already have an account?</Text>
        <TouchableHighlight underlayColor="transparent" onPress={handleNav}>
          <Text className="p-1 text-lg text-pink-500">Login here</Text>
        </TouchableHighlight>
    
      </View>
    </View>
  );
};


export default RegisterPage;
