import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { serverTimestamp } from "firebase/firestore";

// Create a Firestore user profile linked to Auth UID
export const createUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  // 1️⃣ Create the main user document with defaults
  await setDoc(
    userRef,
    {
      bio: "Frontend dev ✨",              // default bio
      photoURL: user.photoURL || null,     // profile picture
      theme: "forest",                     // default theme
      email: user.email,                   // auth email
      categories: ["Social", "Work", "Fun"], // default categories
      createdAt: serverTimestamp(),
    },
    { merge: true } // won’t overwrite existing data
  );

  // 2️⃣ Create an empty "links" subcollection (optional)
  // Firestore allows you to just start adding to it later;
  // this ensures a placeholder if needed
  // eslint-disable-next-line no-unused-vars
  const linksRef = collection(db, "users", user.uid, "links");
  // Can optionally add an initial empty doc if required, but usually empty subcollection is fine
};
