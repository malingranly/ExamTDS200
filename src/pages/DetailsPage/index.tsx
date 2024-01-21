import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, FlatList, ActivityIndicator } from "react-native";
import { usePostContext } from "../../PostContext";
import { db, auth } from "../../../firebase-config";
import { getDoc, doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { User } from "firebase/auth";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Octicons, AntDesign, Entypo } from '@expo/vector-icons';

const DetailsPage: React.FC = () => {
  /// Variables and states
  const { selectedPost, addComment, setPost } = usePostContext();
  const location = selectedPost?.location;
  const [newComment, setNewComment] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [postUsername, setPostUsername] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  /// UseEffects
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (selectedPost && selectedPost.userId) {
        setPostUsername(selectedPost.userId);
  
        const postRef = doc(db, 'posts', selectedPost.name);
        const postSnapshot = await getDoc(postRef);
  
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();
          setPost({
            name: postSnapshot.id,
            ...postData,
          });
        }
      }
    };
  
    fetchPostDetails();
  }, [selectedPost, setPost]);
  
  /* Function to check if the current user is Original Traveler (user that postet the image), or just Traveler (user who did not post the image) */
  const isOriginalTraveler = (userId: string) => {
    return selectedPost?.userId === userId;
  };
  
  /* Handling adding a new comment */
  const handleAddComment = () => {
    if (selectedPost && newComment.trim() !== '' && currentUser) {
      const commenterType = isOriginalTraveler(currentUser.uid) ? "Original Traveler" : "Traveler";
  
      const comment = { // Saving all details
        text: newComment,
        userId: currentUser.uid,
        timestamp: Date.now(),
        commenterType
      };
      console.log("Adding comment:", comment);
  
      addComment(selectedPost.name, comment, commenterType);
      setNewComment('');
    }
  };
  
  /* Handling deleting comment from the UI and from Firebase */
  const handleDeleteComment = async (commentIndex: number) => {
    if (selectedPost && currentUser) {
      try {
        const updatedPost = { ...selectedPost };

        if (updatedPost.comments && updatedPost.comments.length > commentIndex) {
          updatedPost.comments.splice(commentIndex, 1);

          setPost(updatedPost);

          const postRef = doc(db, 'posts', selectedPost.name);
          await updateDoc(postRef, {
            comments: updatedPost.comments,
          });
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <View className="flex-1">
      {selectedPost && (
        <View className="relative p-4 mb-4">
          <Image
            source={{ uri: selectedPost?.url }}
            className="w-max h-96 rounded-lg mb-2"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          <View className="absolute top-4 left-4 p-2 flex-row text-white space-x-2 mb-1">
            <Octicons name={"heart-fill"} color="#fafafa" size={36} />
            <Text className="text-white text-xl">{selectedPost?.likes}</Text>
          </View>
          <View className="">
            <Text>{selectedPost?.caption}</Text>
            <View className="my-2">
              <Text>{location?.coords?.latitude}, {location?.coords?.longitude}</Text>
            </View>
          </View>
        </View>
      )}
      {imageLoading && (
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
              }}
            >
              <ActivityIndicator size="large" color="#E91E63" />
            </View>
          )}
      <Text className="p-4">Comments</Text>
      <FlatList
        data={selectedPost?.comments || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View className="bg-stone-200 p-4 mx-4 mb-4 rounded-3xl flex-row">
            <View className="flex flex-col" style={{ flex: 1 }}>
              <Text className="mb-1 font-medium">
                {isOriginalTraveler(item.userId) ? "Original Traveler" : "Traveler"}
              </Text>
              <Text>{item.text}</Text>
            </View>
            <View className="flex flex-col items-end" style={{ flexShrink: 0, paddingLeft: 8, paddingRight: 8 }}>
              <Text style={{ color: 'gray', fontSize: 12 }}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
              {currentUser?.uid === item.userId && (
                <TouchableOpacity onPress={() => handleDeleteComment(index)}>
                  <AntDesign name="delete" className="text-sm text-black" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      <View className="flex-row p-4">
        <TextInput
          style={{ flex: 1, marginRight: 8 }}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />
        <Entypo name="plus" size={24} color="black" onPress={handleAddComment} />
      </View>
    </View>
  );
};  

export default DetailsPage;
