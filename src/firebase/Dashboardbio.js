// useDashboardProfile.js
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { useAlert } from "../contexts/AlertContext";

export const useDashboardProfile = () => {
  const [bio, setBio] = useState("");
  const [amaEnabled, setAmaEnabled] = useState(true);
  const [phone, setPhone] = useState("");
  const [professionalEmail, setProfessionalEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  // Load profile data from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setBio(data.bio || "");
          setAmaEnabled(data.amaEnabled !== undefined ? data.amaEnabled : true);
          setPhone(data.phone || "");
          setProfessionalEmail(data.professionalEmail || "");
          setJobTitle(data.jobTitle || "");
          setCompany(data.company || "");
          setLocation(data.location || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [auth.currentUser]);

  // Save profile updates to Firestore
  const handleSaveProfile = async (updates) => {
    if (!auth.currentUser) {
       showAlert("You must be logged in to save your profile.", "warning");
       return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, updates, { merge: true });
      
      if (updates.bio !== undefined) setBio(updates.bio);
      if (updates.amaEnabled !== undefined) setAmaEnabled(updates.amaEnabled);
      if (updates.phone !== undefined) setPhone(updates.phone);
      if (updates.professionalEmail !== undefined) setProfessionalEmail(updates.professionalEmail);
      if (updates.jobTitle !== undefined) setJobTitle(updates.jobTitle);
      if (updates.company !== undefined) setCompany(updates.company);
      if (updates.location !== undefined) setLocation(updates.location);
      
      showAlert("Profile updated successfullly! 🚀", "success");
    } catch (err) {
      console.error("Error saving profile:", err);
      showAlert("Failed to save changes. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return { 
    bio, 
    amaEnabled, 
    phone, 
    professionalEmail, 
    jobTitle, 
    company, 
    location,
    setBio, 
    setAmaEnabled, 
    handleSaveProfile, 
    loading 
  };
};
