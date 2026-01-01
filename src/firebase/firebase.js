// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ← Add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDDgDTZu6P3BR2eFhhmAi-ralr4i-Fha7w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eduvibe-97d70.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eduvibe-97d70",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eduvibe-97d70.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "73031401009",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:73031401009:web:4797345a3a92aeb89b5f10",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-19JR8GQQ6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ← Initialize Firestore

export { app, auth, db };
