import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Octicons } from '@expo/vector-icons';
import { db } from "../../../firebase-config";
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { Location, Coordinates } from "../../PostContext";
import axios from 'axios';
import countryEmoji from 'country-emoji';

/// Type 
type File = {
  name: string;
  url?: string;
  caption?: string;
  location?: Location;
};

/// Interface
interface ImageListProps {
  files?: File[];
}

const ImageList: React.FC<ImageListProps> = ({ files = [] }) => {
  /// Variables and states
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [addresses, setAddresses] = useState<{ [key: string]: string }>({});


  /// UseEffect for continuously fetching likecount
  useEffect(() => {
    const loadLikeCounts = async () => {
      try {
        await Promise.all(
          files.map(async (file) => {
            const imageRef = doc(db, 'posts', file.name);
            const imageDoc = await getDoc(imageRef);

            if (imageDoc.exists()) {
              const likeCount = imageDoc.data().likes || 0;
              setLikeCounts((prevCounts) => ({ ...prevCounts, [file.name]: likeCount }));

              // Fetch address using reverse geocoding
              /*
              if (file.location) {
                const address = await getAddressFromCoordinates(file.location.coords);
                setAddresses((prevAddresses) => ({ ...prevAddresses, [file.name]: address }));
              }
              */
            }
          })
        );
      } catch (e) {
        console.error("Error loading like counts:", e);
      }
    };

    loadLikeCounts();
  }, [files]);

  /* Handles toggling of likes, retrieves likecount from Forestore and updates the likescount by incrementing or decrementing based on the state. */
  const handleLike = async (name: string) => {
    try {
      const imageRef = doc(db, 'posts', name);
      const imageDoc = await getDoc(imageRef);

      if (imageDoc.exists()) {
        const currentLikes = imageDoc.data().likes || 0;

        await updateDoc(imageRef, {
          likes: likes[name] ? currentLikes - 1 : currentLikes + 1,
        });

        setLikes((prevLikes) => ({ ...prevLikes, [name]: !likes[name] }));
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [name]: likes[name] ? currentLikes - 1 : currentLikes + 1,
        }));
      } else {
        console.log(`Image ${name} not found`);
      }
    } catch (e) {
      console.log(`Error toggling like for image ${name}, error: ${(e as Error).message}`);
    }
  };

  /*
const getAddressFromCoordinates = async (coords: { latitude: number; longitude: number }): Promise<string> => {
  try {
    const apiKey = '9f7ec782aebb4f42a26d7e71457c74e3';
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${coords.latitude}+${coords.longitude}&key=${apiKey}`);

    if (response.data.results && response.data.results.length > 0) {
      const { city, state, country } = response.data.results[0].components;
      const locationInfo = ` ${country || ''}`.trim();
      const countryEmojiCode = countryEmoji.flag(country) || '';
      return `${locationInfo} ${countryEmojiCode}` || 'Address not found';
    } else {
      return 'Address not found';
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Error fetching address or daily limit exceeded';
  }
};
*/

  const renderItem = ({ item }: { item: File }) => (
    <View className="flex">
      {item.url ? (
        <Image source={{ uri: item.url }} className=" w-max h-96 mb-5 rounded-lg" />
      ) : (
        <Text>No Image Available</Text>
      )}

      <View className="flex flex-row space-x-2 mb-1">
        <TouchableOpacity onPress={() => handleLike(item.name)}>
          <Octicons name={likes[item.name] ? "heart-fill" : "heart"} color="#E91E63" size={36} />
        </TouchableOpacity>

        <Text className="text-lg mt-1 font-normal">{likeCounts[item.name]}</Text>
        
      </View>
      {item.location && (
          <Text>
            {addresses[item.name] && (
              <Text>{addresses[item.name]}</Text>
            )}
          </Text>
        )}
    </View>
  );

  return (
    <FlatList
      data={files}
      renderItem={renderItem}
      keyExtractor={(item) => item?.name}
    />
  );
};


export default ImageList;
