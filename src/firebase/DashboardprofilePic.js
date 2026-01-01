import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth, db } from "./firebase"; // adjust path if needed
import { doc, setDoc } from "firebase/firestore";
import { useAlert } from "../contexts/AlertContext";

export const useDashboardProfilePic = () => {
  const [profilePic, setProfilePic] = useState(auth.currentUser?.photoURL || "");
  const [profileFile, setProfileFile] = useState(null);
  const { showAlert } = useAlert();

  const handleSaveProfilePic = async () => {
    if (!profileFile) return;

    try {
      // Upload to ImgBB
      const formData = new FormData();
      formData.append("image", profileFile);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=10aed3e501f26e66f261b55cd07d72c6",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      
      if (!data.success || !data.data || !data.data.url) {
        throw new Error(data.error?.message || "ImgBB upload failed");
      }
      
      const url = data.data.url; // the direct link

      // Update state
      setProfilePic(url);

      // Update Firebase Auth
      if (auth.currentUser) {
         try {
           await updateProfile(auth.currentUser, { photoURL: url });
         } catch (authErr) {
           console.warn("Could not update Auth profile (non-fatal):", authErr);
         }
      }

      // Update Firestore database
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { photoURL: url }, { merge: true });

      showAlert("Profile picture updated ✅", "success");
      setProfileFile(null); // Reset file input
    } catch (err) {
      console.error("Error updating profile pic:", err);
      showAlert(`Failed to update profile picture: ${err.message}`, "error");
    }
  };

  return { profilePic, setProfilePic, profileFile, setProfileFile, handleSaveProfilePic };
};
