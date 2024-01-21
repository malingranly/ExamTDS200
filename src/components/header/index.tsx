import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Octicons, Feather } from '@expo/vector-icons';

/// Type for the header, helps connect it to the HomePage.
type HeaderProps = {
  onSortChange: (value: "likes" | null) => void;
  onMapPress: () => void;
};

const Header: React.FC<HeaderProps> = ({ onSortChange, onMapPress }) => {
  return (
    <View className="flex-row justify-between mt-10 p-6 items-center">
      <View>
        <View className="flex-row text-black">
          <Text className="text-2xl font-semibold">Hello, </Text>
          <Text className="text-2xl text-pink-600 font-semibold">traveler!</Text>
        </View>
        <Text className="text-black">Where are you going today?</Text>
      </View>
      <TouchableOpacity className="ml-16" onPress={() => onSortChange("likes")}>
      <Octicons name="filter" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity  onPress={onMapPress}>
        <Feather name="map" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
