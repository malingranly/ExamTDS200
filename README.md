# TravelSnap
TravelSnap is a mobile application built with React Native Expo that focuses on image sharing, geolocations, and connecting with other travelers for tips and tricks.

## DESCRIPTION
TravelSnap aims to provide a seamless experience for users who want to share their travel experiences through images, explore geolocations, and connect with fellow travelers to exchange valuable tips and tricks.

## FEATURES
- **Image Sharing:** Share your favorite travel moments by uploading images or take images in real-time!
- **Geolocations:** Explore various travel destinations and view images shared by Travelers in specific locations.
- **Connect with Travelers:** Connect with other Travelers, share travel tips, and discover new places to explore.
- **Anonymous:** No follower counts or unnecessary features. It is all about creating a laid-back space where everyone can share their travel photos and tips – no matter if you are an influencer or just starting out!
- **Filtering:** Filter the image list based on like count!

## USAGE
- Open the app on your iOS simulator, Android emulator or on your own decive (Expo Go).
- Explore images shared by other travelers in various locations.
- Share your own travel moments by uploading images.
- Connect with other Travelers, ask for tips, and share your travel experiences.

## IMPORTANT NOTE
- When filming the demo of my app, my daily quota had *exceeded* for Firebase Storage and did not want to renew. Therefore, none of the images loaded, leading to whitespace and missing images scouted across the application. So when watching, imagine beautiful travel photos where there is whitespace. Running the app normal on your device some days/weeks later will probably have renewed the quota, and you can see the images in all the places they should be (in homepage, detailpage, mapview with markers, profileview under your locations and your posts). Also, the uploading to Firebase will work when the quota is refilled :). I have checked the functionality and I am 100% certain that it fetches the images/posts, and that it can upload to Firebase. I am adding some images of how the app is intended to look with the images in the places i was able to screenshot before the quota exceeded, see assets/images/screenshots. 

## HOW TO RUN ON iOS/ANDROID SIMULATOR AND EXPO GO
To run TravelSnap on an **iOS simulator**, follow these steps:
1. Make sure you have downloaded the 'node_modules' (npm install) 
2. Run npm start in your terminal
3. After starting the application, a menu will appear in the terminal. To launch the iOS simulator, press *i* and hit Enter

To run TravelSnap on **Android emulator**, follow these steps:
1. Make sure you have downloaded the 'node_modules' (npm install) 
2. Run npm start in your terminal
3. After starting the application, a menu will appear in the terminal. To launch the Android emulator, press *a* and hit Enter

To run TravelSnap with **Expo Go**, follow these steps:
1. Make sure you have downloaded the 'node_modules' (npm install) 
2. Run npm start in your terminal
3. After starting the application, a QR code will be displayed in the terminal. Open the Expo Go app on your device and scan the QR code with your device's camera to launch TravelSnap.

(To run on the different simulators, they have to be downloaded. The app was tested on Xcode Simulator, Expo Go app).

## SOURCES USED
- Handle platform differences. (n.d.). Expo Documentation. Retrieved from https://docs.expo.dev/tutorial/platform-differences/

- React Native Maps Magic: Adding Google Maps and Markers with Expo Under 10 Minutes. (n.d.). Www.linkedin.com. Retrieved from https://www.linkedin.com/pulse/
react-native-maps-magic-adding-google-markers-expo-under-liyanage 

- ‌Sivaraja, S. (2023, June 19). Integrating Real-time Map with User Location in a React Native App. Medium. Retrieved from https://medium.com/@Sarmilasivaraja/integrating-real-time-map-with-user-location-in-a-react-native-app-d0bef63ba3b2

- ImagePicker. (n.d.). Expo Documentation. Retrieved from https://docs.expo.dev/versions/latest/sdk/imagepicker/#imagepickergetcamerapermissionsasync

- ‌React Native Expo Firebase - Simplify Your Image Uploads with Image Picker Camera. (n.d.). Www.youtube.com. Retrieved from https://www.youtube.com/watch?app=desktop&v=tX_HPvwB-5c&ab_channel=AaronSaunders&fbclid=IwAR2pkZSxZskppi-9oObAg-VIBT70-OhdDXJpFLFksdHvus_GJTHOCaTEU8E

- ‌List files with Cloud Storage on Web | Cloud Storage for Firebase. (n.d.). Firebase. Retrieved from https://firebase.google.com/docs/storage/web/list-files#web-modular-api

- ‌Use Firebase. (n.d.). Expo Documentation. Retrieved from https://docs.expo.dev/guides/using-firebase/#using-react-native-firebase

- ‌Martinez, J. C. (2022, January 14). Integrating Firebase authentication into an Expo mobile app. LogRocket Blog. Retrieved from https://blog.logrocket.com/integrating-firebase-authentication-expo-mobile-app/

- ‌How do I set a marker in MapView of React Native. (n.d.). Stack Overflow. Retrieved from https://stackoverflow.com/questions/29412753/how-do-i-set-a-marker-in-mapview-of-react-native

- ‌Perform simple and compound queries in Cloud Firestore. (n.d.). Firebase. Retrieved from https://firebase.google.com/docs/firestore/query-data/queries#node.js_9
‌
Tailwind/NativeWind for styling.
https://icons.expo.fyi/Index for icons.
https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding for reverse geocoding.

npm packages/dependencies installed:
@react-native-async-storage/async-storage (^1.18.2)
@react-native-community/masked-view (^0.1.11)
@react-navigation/bottom-tabs (^6.5.11)
@react-navigation/native (^6.1.9)
@react-navigation/stack (^6.3.20)
axios (^1.6.2)
babel-preset-expo (^9.5.2)
country-emoji (^1.5.6)
dotenv (^16.3.1)
expo (~49.0.8)
expo-image-picker (~14.3.2)
expo-linear-gradient (~12.3.0)
expo-location (~16.1.0)
firebase (^10.7.1)
nativewind (^2.0.11)
react-native-maps (1.7.1)
react-native-reanimated (~3.3.0)
react-native-safe-area-context (4.6.3)
react-native-screens (~3.22.0)
@babel/core (^7.23.5)
@babel/preset-env (^7.23.5)
@react-native-async-storage/root (github:react-native-async-storage/async-storage)
@tsconfig/react-native (^3.0.2)
@types/jest (^29.5.4)
@types/lodash (^4.14.202)
@types/react (~18.2.14)
babel-plugin-module-resolver (^5.0.0)
postcss (^8.4.23)
react-native-dotenv (^3.4.9)
tailwindcss (^3.3.2)
typescript (^5.1.6)

## CONTACT
If you have any questions or feedback, feel free to reach out to me at Student number [2066].

Happy Travels from the TravelSnap-team! 🌍✈️