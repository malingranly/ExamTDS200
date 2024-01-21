import React, { useEffect, useState } from "react";
import { Text, View, Image, ActivityIndicator } from "react-native";
import useOwnNavigation from "../../hooks/useOwnNavigation";
import { auth, db } from "../../../firebase-config";
import { collection, where, query } from "firebase/firestore";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PostProvider, usePostContext } from "/Users/malingranly/Documents/travelSnap/src/PostContext/index";
import { onSnapshot } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';

/// Types
type UserInfo = {
  name: string;
};

type UserPost = {
  imageURL: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

const ProfilePage: React.FC = () => {
  /// Variables and states
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<any[]>([]); 
  const [typedUserPosts, setTypedUserPosts] = useState<UserPost[]>([]); 
  const { selectedPost } = usePostContext();
  const { navigate } = useOwnNavigation();

  /* Handling log out, navigated back to welcome */
  const handleLogOut = () => {
    console.log("Logged out");
    navigate("Welcome");
  };

  /* Fetching user info and posts */
  const fetchInfo = async () => {
    try {
      console.log("Fetching user info...");
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }
  
      const { displayName } = user;
      const userName = displayName || "";
      const userData = { name: userName };
      setUserInfo(userData);
      console.log("User Data:", userData);
  
      /* Fetch users posts so they can be displayed in the UI */
      const q = query(collection(db, "posts"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts: UserPost[] = querySnapshot.docs.map((doc) => {
          console.log("Fetched post data:", doc.data());
          const { imageURL, userId, location, likes, caption } = doc.data();
          const { latitude = 0, longitude = 0 } = location?.coords || {};
  
          return {
            imageURL,
            userId,
            location: { latitude, longitude },
            likes,
            caption,
          };
        });
  
        console.log("Fetched posts:", posts);
        setUserPosts(posts);
        setTypedUserPosts(posts);
        setLoading(false);
        console.log("Loading state set to false");
      });
  
      /* Clean the listener */
      return () => unsubscribe();
    } catch (error) {
      console.log("Error fetching userinfo " + (error as Error).message);
      setLoading(false);
      console.log("Loading state set to false");
    }
  };
  
  /// UseEffect for continuously fetching the user info.
  useEffect(() => {
    fetchInfo();
  }, []);

  console.log("Rendering component...");

  if (loading) {
    console.log("Rendering loading indicator...");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  const username = userInfo?.name || "";

  return (
    <View className="flex-1 flex-col justify-between mt-10 p-4 h-full">
      <View className="bg-pink-600 p-4 rounded-lg flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Your profile, {username}</Text>
        <Ionicons name="log-out-outline" size={24} color="white" onPress={handleLogOut}/>
      </View>

      <View className="flex mb-6">
        <Text className="p-2 text-base">Your locations</Text>
        <MapView
          cacheEnabled={false}
          loadingEnabled={true}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton
          className="w-full h-64 mt-2 rounded-lg"
          style={{ borderRadius: 8 }}
          initialRegion={{
            latitude: 59.9139,
            longitude: 10.7522,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {typedUserPosts.map((post, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: post.location.latitude,
                longitude: post.location.longitude,
              }}
            >
              <Image
                source={{ uri: post.imageURL }}
                style={{ width: 40, height: 40, borderRadius: 2 }}
              />
            </Marker>
          ))}
        </MapView>
      </View>

      <Text className="p-2 text-base">Your posts</Text>
      <View className="flex flex-row flex-wrap rounded-lg">
        {userPosts.map((item, index) => (
          <View key={index} className="w-1/3 p-1">
            <Image
              className="w-full h-28 rounded"
              source={{ uri: item?.imageURL }}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>
    </View>
  );
  
};  

const ProfilePageWithPostContext: React.FC = () => {
  return (
    <PostProvider>
      <ProfilePage />
    </PostProvider>
  );
};

export default ProfilePageWithPostContext;
