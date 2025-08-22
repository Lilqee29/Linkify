// useDashboardProfile.js
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export const useDashboardProfile = () => {
  const [bio, setBio] = useState("");

  // Load bio from Firestore
  useEffect(() => {
    const fetchBio = async () => {
      if (!auth.currentUser) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setBio(data.bio || "");
      }
    };

    fetchBio();
  }, [auth.currentUser]);

  // Save bio to Firestore
  const handleSaveBio = async (newBio) => {
    if (!auth.currentUser) return;

    try {
      setBio(newBio); // update state immediately
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { bio: newBio }, { merge: true });
      alert("Bio updated ✅");
    } catch (err) {
      console.error("Error saving bio:", err);
    }
  };

  return { bio, setBio, handleSaveBio };
};
