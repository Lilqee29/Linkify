// useDashboardProfile.js
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { useAlert } from "../contexts/AlertContext";

export const useDashboardProfile = () => {
  const [bio, setBio] = useState("");
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  // ... (rest of the code)
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
       showAlert("You must be logged in to save your bio.", "warning");
       return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { bio: newBio }, { merge: true });
      setBio(newBio); // Update local state only after successful save
      showAlert("Bio updated successfullly! 🚀", "success");
    } catch (err) {
      console.error("Error saving bio:", err);
      showAlert("Failed to save bio. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return { bio, setBio, handleSaveBio, loading };
};
