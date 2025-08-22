import { doc, setDoc, getDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Create a Firestore user profile linked to Auth UID
export const createUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // Only set defaults if the document does not exist
    await setDoc(userRef, {
      bio: "",              // default bio
      photoURL: user.photoURL || null,     // profile picture
      theme: "forest",                     // default theme
      email: user.email,                   // auth email
      categories: ["Social", "Work", "Fun"], // default categories
      createdAt: serverTimestamp(),
    });
  }
  
  // Optional: links subcollection
  // eslint-disable-next-line no-unused-vars
  const linksRef = collection(db, "users", user.uid, "links");
};
