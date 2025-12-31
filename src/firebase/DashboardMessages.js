import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

export const useDashboardMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch messages for the logged-in user (Dashboard side)
  const fetchMessages = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const msgsRef = collection(db, "users", auth.currentUser.uid, "messages");
      const q = query(msgsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [auth.currentUser]);

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "messages", id));
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return { messages, loading, fetchMessages, handleDeleteMessage };
};

// Function for Public Profile to send a message
export const sendMessageToUser = async (targetUserId, text) => {
  if (!text.trim()) return;
  try {
    const msgsRef = collection(db, "users", targetUserId, "messages");
    await addDoc(msgsRef, {
      text,
      createdAt: serverTimestamp(),
      read: false
    });
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};
