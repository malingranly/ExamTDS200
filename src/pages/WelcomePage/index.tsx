import React from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native';
import useOwnNavigation from '../../hooks/useOwnNavigation';
import { FontAwesome } from '@expo/vector-icons';

const WelcomePage = () => {
  // Variables
  const { navigate } = useOwnNavigation();

  return (
    <View className='flex-1 p-4 justify-between'>
      <View className='justify-center items-start mb-30'>
        <FontAwesome name="plane" size={16} color="#000000" className='mb-10'/>
        <Text className='text-6xl text-pink-600'>TravelSnap</Text>
        <View className='flex-row justify-center items-center '>
          <Text className='text-2xl text-black'>Find new travel experiences</Text>
          <Text className='text-4xl text-pink-600 mb-1'>.</Text>
        </View>
       <View className='flex-row justify-center items-center'>
        <Text className='text-2xl text-black'>Connect with others</Text>
        <Text className='text-4xl text-pink-600 mb-1'>.</Text>
       </View>
       <View className='flex-row justify-center items-center'>
        <Text className='text-2xl text-black'>All anonymous</Text>
        <Text className='text-4xl text-pink-600 mb-1'>.</Text>
       </View>
      </View>
      <View className='items-center justify-center mb-10'>
      <TouchableHighlight underlayColor="transparent" onPress={() => navigate('LoginPage')} className='mb-4'>
          <Text className='text-xl '>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="transparent" onPress={() => navigate('RegisterPage')} className=''>
          <Text className='text-xl'>Register</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default WelcomePage;
