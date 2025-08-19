// app.config.js
require('dotenv').config();

export default {
  name: "ParkGuard",
  slug: "parkguard",
  version: "1.0.0",
  newArchEnabled: true,
  orientation: "portrait",
  scheme: "pg",
  userInterfaceStyle: "light",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#fefaf1"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.freefly.parkguard"
  },
  android: {
    package: "com.freefly.parkguard",
    permissions: [
      "android.permission.CAMERA",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.FOREGROUND_SERVICE"
    ]
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "@react-native-firebase/app",
      {
        firebaseClientVersion: "33.1.1"
      }
    ],
    [
      "@react-native-firebase/auth",
      {
        firebaseClientVersion: "33.1.1"
      }
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#ffffff"
      }
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Allow ParkGuard to save your parking location to access it in your scan history.",
        locationWhenInUsePermission: "Allow ParkGuard to save your parking location to access it in your scan history."
      }
    ]
  ],
  extra: {
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || ''
    },
    environment: process.env.NODE_ENV || "production",
    eas: {
      projectId: "b26a2910-d070-40ee-8a0a-ba18277fe40d"
    }
  }
};