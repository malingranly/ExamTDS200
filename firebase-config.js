import React from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { FIREBASE_API_KEY, FIREBASE_STORAGE_BUCKET, FIREBASE_APP_ID, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID } from "@env";
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { comma } from 'postcss/lib/list';

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  appId: FIREBASE_APP_ID,
  projectId: FIREBASE_PROJECT_ID,
  authDomain: FIREBASE_AUTH_DOMAIN,
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
  
}


const fbApp = getApp();
const fbStorage = getStorage();
const db = getFirestore(fbApp);

let auth = getAuth(fbApp);

// Ensure auth is initialized only once
if (Platform.OS === 'ios') {
  // Initialize authentication only for iOS
  if (!auth) {
    initializeAuth(fbApp, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  }
}

const listFiles = async () => {
  const storage = await getStorage();
  const listRef = ref(storage, 'images');

  try {
    const listResponse = await listAll(listRef);
    const files = await Promise.all(
      listResponse.items.map(async (item) => {
        const downloadUrl = await getDownloadURL(item);
        return { name: item.name, url: downloadUrl };
      })
    );
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

const uploadToFirebase = async (uploadOptions) => {
  const { uri, name, onProgress = () => {} } = uploadOptions;

  const fetchResponse = await fetch(uri);
  const blob = await fetchResponse.blob();

  const imageReference = ref(getStorage(), `images/${name}`);
  const uploadTask = uploadBytesResumable(imageReference, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          downloadUrl,
          metadata: uploadTask.snapshot.metadata,
          
        });
      }
    );
  });
};

const saveImageDetailsToFirestore = async ({ userId, downloadUrl, caption, location, likes, comments }) => {
  try {
   
    const postRef = await addDoc(collection(db, 'posts'), {
      userId: userId,
      imageURL: downloadUrl,
      caption: caption,
      location: location,
      likes: likes,
      timestamp: serverTimestamp(),
    });

    if (comments && comments.length > 0) {
      
      const postId = postRef.id;

    
      const commentsCollection = collection(db, `posts/${postId}/comments`);

      comments.forEach(async (comment) => {
        await addDoc(commentsCollection, comment);
      });
    }

    console.log('Image details saved to Firestore');
  } catch (error) {
    console.error('Error saving image details to Firestore:', error);
    throw error;
  }
};



const saveAuthTokenToStorage = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};

const getAuthTokenFromStorage = async () => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    return authToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const removeAuthTokenFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User registered:', user.uid);

    

    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

const saveUserToFirestore = async (userId, userEmail, userName) => {
  try {
    await addDoc(collection(db, 'users'), {
      userId: userId,
      userEmail: userEmail,
      userName: userName,
    });
    console.log('User details saved to Firestore');
  } catch (error) {
    console.error('Error saving user details to Firestore:', error);
    console.error('Firestore Error Code:', error.code);
    console.error('Firestore Error Message:', error.message);
    throw error;
  }
};


const loginUser = async (email, password) => {
  try {
    console.log('Before loginUser');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('After loginUser');
    const user = userCredential.user;
    console.log('User logged in:', user.uid);

    // Save user token to AsyncStorage
    await saveAuthTokenToStorage('authToken');

    return user;
  } catch (error) {
    console.error('Error during login:', error);
    Alert.alert('Error', 'Invalid email or password');
    throw error;
  }
};

export {
  fbApp,
  fbStorage,
  uploadToFirebase,
  listFiles,
  registerUser,
  loginUser,
  auth,
  saveAuthTokenToStorage,
  getAuthTokenFromStorage,
  removeAuthTokenFromStorage,
  saveImageDetailsToFirestore,
  db,
  saveUserToFirestore
};
