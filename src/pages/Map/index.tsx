import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from "../../../firebase-config";

/// Interface
interface ImageMarker {
  imageURL: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const Map: React.FC = () => {
  /// Variables and states  
  const [imageMarkers, setImageMarkers] = useState<ImageMarker[]>([]);

  /// UseEffect for fetching images from Firestore
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const postsCollectionRef = collection(db, 'posts');
        const unsubscribe = onSnapshot(postsCollectionRef, (querySnapshot) => {
          const markers: ImageMarker[] = querySnapshot.docs.map((doc) => {
            console.log("Fetched post data:", doc.data());
            const { imageURL, location } = doc.data();
            const { latitude = 0, longitude = 0 } = location?.coords || {};
    
            return {
              imageURL,
              location: { latitude, longitude },
            };
          });

          setImageMarkers(markers);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []); 
  
  /* Setting initial region to central Europe */
  const initialRegion = {
    latitude: 51.1657,    
    longitude: 10.4515,   
    latitudeDelta: 20,     
    longitudeDelta: 30,   
  };
  
  return (
    <View className="flex-1 p-4 mt-10 mb-6">
        <View className="flex-row mb-4">
        <Text className="text-2xl font-medium">Where our</Text>
        <Text className="text-2xl font-medium text-pink-600 italic"> Travelers</Text>
        <Text className="text-2xl font-medium"> have been</Text>
        </View>
      
      <MapView
        cacheEnabled={false}
        loadingEnabled={true}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        style={{ flex: 1, borderRadius: 8 }}
        initialRegion={initialRegion}
         >
        {imageMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.location.latitude,
              longitude: marker.location.longitude,
            }}
            title={`Marker ${index + 1}`}
            >
            <View style={{ backgroundColor: 'transparent', padding: 5 }}>
              <Image
                source={{ uri: marker.imageURL }}
                style={{ width: 40, height: 40, borderRadius: 2 }}
              />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default Map;
