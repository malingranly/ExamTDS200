import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, TouchableHighlight } from 'react-native';
import { loginUser } from '/Users/malingranly/Documents/travelSnap/firebase-config';
import useOwnNavigation from '/Users/malingranly/Documents/travelSnap/src/hooks/useOwnNavigation';
import { listFiles } from '/Users/malingranly/Documents/travelSnap/firebase-config.js';


const LoginPage = () => {
  /// Variables and states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useOwnNavigation()
  const [loading, setLoading] = useState(false);

  /* Fetching files */
  const fetchFiles = async () => {
    const listResponse = await listFiles();
    const updatedFiles = listResponse.map((value) => ({
      name: value.name,
      url: value.url,
    }));
    return updatedFiles;
  };

  /* Handling the login */
  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    try {
      setLoading(true);
      console.log('Before loginUser');
      await loginUser(email, password);
      console.log('After loginUser');

      const files = await fetchFiles();
      console.log('User logged in successfully');
      console.log('Files:', files);
      try {

        navigate('HomeRoutes' as never);
      } catch (error) {
        console.error('Error during login:', error);
      }
      
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='flex-1 justify-center items-center p-4'>
      <Text className='text-lg mb-2'>Email:</Text>
      <TextInput className="h-10 w-52 p-2 border-2 border-pink-600 mb-2 rounded-lg" value={email} onChangeText={setEmail} />
      <Text className='text-lg mb-2'>Password:</Text>
      <TextInput className="h-10 w-52 p-2 border-2 border-pink-600 mb-2 rounded-lg" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableHighlight onPress={handleLogin}>
        <Text className='text-lg text-black p-1'>Login</Text>
      </TouchableHighlight>
   
      {loading && <ActivityIndicator size="small" color="#E91E63" />}
    </View>
  );
};

export default LoginPage;
