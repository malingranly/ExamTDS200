import React, { useEffect, useState } from "react";
import { Text, View, Button, TextInput, Alert, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { listFiles, uploadToFirebase, saveImageDetailsToFirestore, auth } from '/Users/malingranly/Documents/travelSnap/firebase-config.js';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, usePostContext } from '/Users/malingranly/Documents/travelSnap/src/PostContext/index';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableHighlight } from "react-native";

/// Type
type File = {
  name: string;
  url: string;
};

const UploadPage: React.FC = () => {
  /// Variables and states
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Post['location'] | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setPost } = usePostContext();

  /* UseEffect for checking and requesting permissions */
  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      const permissionsRequested = await AsyncStorage.getItem('authToken');
      
      if (!permissionsRequested) { // If permission not permitted, request again
        requestPermission();
        await Location.requestForegroundPermissionsAsync();
        await AsyncStorage.setItem('authToken', 'true');
      }

    listFiles().then((listResponse) => {
      const files = listResponse.map((value) => {
        return { name: value.name, url: value.url } as File;
      });
      setFiles(files);
    });

    getLocation();
  };
  checkAndRequestPermissions();
  }, []);

  /* Function for getting use current location */
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location denied.');
        return;
      }
  
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation({
        coords: {
          ...locationData.coords,
         
        },
      });
    } catch (e) {
      console.log("Error getting location " + (e as Error).message);
    }
  };
  
  /* Handling the choose image from library */
  const chooseImage = async () => {
    try {
      const libraryResponse = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!libraryResponse.canceled) {
        const { uri } = libraryResponse.assets?.[0] || {};
        if (uri) {
          setPreviewImage(uri);
        }
      }
    } catch (e) {
      Alert.alert('Error choosing image from library: ' + (e as Error).message);
    }
  };

  /* Handling the take image from your phone */
  const takePhoto = async () => {
    try {
      const cameraResponse = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1
      });

      if (!cameraResponse.canceled) {
        const { uri } = cameraResponse.assets?.[0] || {};
        if (uri) {
          setPreviewImage(uri);
        }
      }
    } catch (e) {
      Alert.alert('Error taking photo: ' + (e as Error).message);
    }
  };

  /* Handling upload of images to Firestore and to Storage */
  const handleUpload = async () => {
    try {
      if (previewImage) {
        setLoading(true);
        const fileName = previewImage.split('/').pop();
        const onProgress = (progress: number) => {
          console.log(`Upload progress: ${progress}%`);
        };

        const uploadResponse = await uploadToFirebase({
          uri: previewImage,
          name: fileName || '',
          onProgress,
        });

        setLoading(false);
        console.log('Image uploaded successfully:', uploadResponse);

        const { downloadUrl } = uploadResponse;
        const authenticatedUser = auth.currentUser ? auth.currentUser.uid : 'defaultUserId'

        setLoading(true);
        console.log('Saving image details to Firestore...');
        await saveImageDetailsToFirestore({ // Saving the post info to Firestore
          userId: authenticatedUser,
          downloadUrl,
          caption,
          location,
          likes: 0,
          comments: 0,
        });

        setLoading(false);
        console.log('Image details saved successfully.');
        
        Alert.alert('Upload Success', 'Image uploaded and details saved successfully.');

        setPost({
          name: fileName || '',
          url: downloadUrl,
          caption,
          location,
          likes: 0,
          
        });

        listFiles().then((listResponse) => {
          const updatedFiles = listResponse.map((value) => ({
            name: value.name,
            url: value.url,
          }));
          setFiles(updatedFiles);
        });

        setPreviewImage(null); // Setting values back to null after the upload
        setCaption('');
        //setLocation(null);
      }
    } catch (e) {
      setLoading(false);
      console.error('Error during upload or saving details:', e);
      Alert.alert('Error uploading image: ' + (e as Error).message);
    }
  };

  /* Permission check */
  if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
    return (
      <View className="flex-1">
        <View className="p-16">
          <Text>Permission not granted - {permission?.status}</Text>
          <Button title="Request permission" onPress={requestPermission}></Button>
        </View>
      </View>
    );
  }

  /* Main ui */
  return (
    <View className="flex-1 mt-10">
      <View className="p-4 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold mr-4">Upload a post</Text>
        <View className="flex-row space-x-2">
          <MaterialIcons name="photo-library" size={24} color="black" onPress={chooseImage} />
          <MaterialCommunityIcons name="camera" size={24} color="black" onPress={takePhoto}/>
        </View>
      </View>
  
      {previewImage && <Image source={{ uri: previewImage }} className="w-full h-96 rounded mt-10" />}
      {previewImage && (
      <TextInput
        className="h-36 mt-10 rounded bg-stone-200 p-2 mx-4 rounded"
        placeholder="Enter caption"
        onChangeText={(text) => setCaption(text)}
        value={caption}
      />
      )}
    <View className="flex flex-1 justify-center items-center">
      <TouchableHighlight className="p-2.5 rounded-full bg-pink-600" onPress={handleUpload}>
        <Text className="text-white">Upload post</Text>
      </TouchableHighlight>
    </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
  
};

export default UploadPage;
