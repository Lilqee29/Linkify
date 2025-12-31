import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

// Track a link click (increment the counter in Firestore)
export const trackLinkClick = async (userId, linkId) => {
  try {
    const linkRef = doc(db, "users", userId, "links", linkId);
    await updateDoc(linkRef, {
      clicks: increment(1)
    });
    return true;
  } catch (error) {
    console.error("Error tracking click:", error);
    return false;
  }
};
