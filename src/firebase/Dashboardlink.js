// dashboardLinks.js
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // adjust path if needed
import { useAlert } from "../contexts/AlertContext";

export const useDashboardLinks = () => {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState(["Social", "Work", "Fun"]);
  const [newCategory, setNewCategory] = useState(""); // Added state for new category input
  const { showAlert } = useAlert();

  // Load links from Firestore
  // ... (lines 11-33)
  useEffect(() => {
    const fetchLinks = async () => {
      if (!auth.currentUser) return;

      const linksCol = collection(db, "users", auth.currentUser.uid, "links");
      const q = query(linksCol, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const fetchedLinks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLinks(fetchedLinks);

      // Extract categories dynamically, keeping defaults
      const defaults = ["Social", "Work", "Fun"];
      const fetchedCats = fetchedLinks.map(link => link.category).filter(Boolean);
      const uniqueCats = [...new Set([...defaults, ...fetchedCats])];
      setCategories(uniqueCats);
    };

    fetchLinks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser]);

  // Add or edit link
  const handleLinkSubmit = async (formData, editLink, setModalOpen) => {
    if (!auth.currentUser) {
      showAlert("You need to be logged in to save links.", "warning");
      return;
    }

    if (!formData.title || !formData.url) {
      showAlert("Title & URL are required!", "error");
      return;
    }

    // Basic URL validation
    let urlToSave = formData.url;
    if (!/^https?:\/\//i.test(urlToSave)) {
        urlToSave = "https://" + urlToSave;
    }
    
    const finalData = { ...formData, url: urlToSave };

    // Sanitize data (Firestore rejects undefined)
    const sanitizedData = Object.fromEntries(
      Object.entries(finalData).filter(([_, v]) => v !== undefined)
    );

    try {
      if (editLink) {
        // Update existing link
        const linkRef = doc(db, "users", auth.currentUser.uid, "links", editLink.id);
        await setDoc(linkRef, sanitizedData, { merge: true });
        
        setLinks(prev => prev.map(l => (l.id === editLink.id ? { ...l, ...sanitizedData } : l)));
        showAlert("Link updated! 🎉", "success");
      } else {
        // Add new link
        const linksCol = collection(db, "users", auth.currentUser.uid, "links");
        
        // Use addDoc to auto-generate ID
        const docRef = await addDoc(linksCol, { ...sanitizedData, createdAt: serverTimestamp() });
        
        // Prepend logic to match "orderBy desc" (newest first)
        // We use sanitizedData for the local state, assuming createdAt will be fetched later
        setLinks(prev => [{ id: docRef.id, ...sanitizedData }, ...prev]);
        
        // Also update categories if new one is added
        if (sanitizedData.category && !categories.includes(sanitizedData.category)) {
             setCategories(prev => [...prev, sanitizedData.category]);
        }
        showAlert("Link added! 🚀", "success");
      }
      
      setModalOpen(false);

    } catch (err) {
      console.error("Error saving link:", err);
      showAlert(`Failed to save link: ${err.message}`, "error");
    }
  };

  // Delete link
  const handleDeleteLink = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "links", id));
      setLinks(prev => prev.filter(link => link.id !== id));
    } catch (err) {
      console.error("Error deleting link:", err);
    }
  };

  return { 
    links, 
    setLinks, 
    categories, 
    setCategories, 
    newCategory,       // Added to returned values
    setNewCategory,    // Added to returned values
    handleLinkSubmit, 
    handleDeleteLink 
  };
};
