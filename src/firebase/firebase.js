// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ← Add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDgDTZu6P3BR2eFhhmAi-ralr4i-Fha7w",
  authDomain: "eduvibe-97d70.firebaseapp.com",
  projectId: "eduvibe-97d70",
  storageBucket: "eduvibe-97d70.firebasestorage.app",
  messagingSenderId: "73031401009",
  appId: "1:73031401009:web:4797345a3a92aeb89b5f10",
  measurementId: "G-19JR8GQQ6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ← Initialize Firestore

export { app, auth, db };
