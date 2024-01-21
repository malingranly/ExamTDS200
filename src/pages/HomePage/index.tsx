import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableHighlight } from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { db } from "/Users/malingranly/Documents/travelSnap/firebase-config.js";
import useOwnNavigation from "../../hooks/useOwnNavigation";
import { useNavigation } from '@react-navigation/native';
import { usePostContext } from "../../PostContext/index";
import Header from "../../components/header";
import ImageList from '../../components/list/ImageList';

/// Type
type File = {
  name: string;
  url?: string;
  caption?: string;
  likes?: number;
};

const HomePage: React.FC = () => {
  /// Variables and states
  const [files, setFiles] = useState<File[]>([]);
  const [sorting, setSorting] = useState<"likes" | null>(null); 
  const { navigate } = useOwnNavigation();
  const navigation = useNavigation();
  const { setPost } = usePostContext();

  /// UseEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsCollectionRef = collection(db, 'posts'); // Fetching from Firestore collection 'posts'
        const querySnapshot = await getDocs(postsCollectionRef);
        
        const listResponse = querySnapshot.docs.map((doc) => ({
          caption: doc.data().caption,
          url: doc.data().imageURL,
          likes: doc.data().likes,
          location: doc.data().location,
          userId: doc.data().userId,
          name: doc.id,
        }));

        /* Sort the list based on selected field or keep original order */
        const sortedList = sorting ? listResponse.sort((a, b) => b[sorting]! - a[sorting]!) : listResponse;

        setFiles(sortedList);
      } catch (error) {
        console.error('Error fetching files from Firestore:', error);
      }
    };

    fetchData();
  }, [sorting]); 
  const handleMapPress = () => {
    console.log('Navigating to MapPage');
    navigation.navigate("Map" as never)
  };

  const handleSortChange = () => {
    /* Toggle sorting between likes and default */
    setSorting((prevSorting) => (prevSorting === "likes" ? null : "likes"));
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        onSortChange={handleSortChange} 
        onMapPress={handleMapPress}
      />
      <FlatList
        data={files}
        keyExtractor={(item) => item?.name}
        renderItem={({ item }) => (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              console.log('Navigating to DetailsPage');
              setPost(item);
              navigation.navigate("DetailsPage" as never);
            }}
          >
            <View style={{ padding: 16 }}>
              <ImageList files={[item]} />
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
};

export default HomePage;
