// dashboardLinks.js
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // adjust path if needed

export const useDashboardLinks = () => {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState(["Social", "Work", "Fun"]);
  const [newCategory, setNewCategory] = useState(""); // Added state for new category input

  // Load links from Firestore
  useEffect(() => {
    const fetchLinks = async () => {
      if (!auth.currentUser) return;

      const linksCol = collection(db, "users", auth.currentUser.uid, "links");
      const q = query(linksCol, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const fetchedLinks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLinks(fetchedLinks);

      // Extract categories dynamically
      const allCats = [...new Set(fetchedLinks.map(link => link.category).filter(Boolean))];
      setCategories(allCats.length ? allCats : ["Social", "Work", "Fun"]);
    };

    fetchLinks();
  }, [auth.currentUser]);

  // Add or edit link
  const handleLinkSubmit = async (formData, editLink, setModalOpen) => {
    if (!formData.title || !formData.url) return alert("Title & URL are required!");

    if (editLink) {
      // Update existing link
      try {
        const linkRef = doc(db, "users", auth.currentUser.uid, "links", editLink.id);
        await setDoc(linkRef, formData, { merge: true });
        setLinks(prev => prev.map(l => (l.id === editLink.id ? { ...l, ...formData } : l)));
      } catch (err) {
        console.error("Error updating link:", err);
      }
    } else {
      // Add new link
      try {
        const linksCol = collection(db, "users", auth.currentUser.uid, "links");
        const docRef = await addDoc(linksCol, { ...formData, createdAt: serverTimestamp() });
        setLinks(prev => [...prev, { id: docRef.id, ...formData }]);
      } catch (err) {
        console.error("Error adding link:", err);
      }
    }

    setModalOpen(false);
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
