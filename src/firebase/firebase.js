// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app, auth};