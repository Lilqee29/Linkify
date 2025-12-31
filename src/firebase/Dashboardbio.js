// useDashboardProfile.js
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export const useDashboardProfile = () => {
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);

  // Load bio from Firestore
  useEffect(() => {
    const fetchBio = async () => {
      if (!auth.currentUser) return;

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setBio(data.bio || "");
        }
      } catch (error) {
        console.error("Error fetching bio:", error);
      }
    };

    fetchBio();
  }, [auth.currentUser]);

  // Save bio to Firestore
  const handleSaveBio = async (newBio) => {
    if (!auth.currentUser) {
       alert("You must be logged in to save your bio.");
       return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { bio: newBio }, { merge: true });
      setBio(newBio); // Update local state only after successful save
      alert("Bio updated successfullly! 🚀");
    } catch (err) {
      console.error("Error saving bio:", err);
      alert("Failed to save bio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { bio, setBio, handleSaveBio, loading };
};
