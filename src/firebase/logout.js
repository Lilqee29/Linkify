// src/firebase/logout.js
import { getAuth, signOut } from "firebase/auth";

export const logOutUser = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log("User successfully logged out");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error; // so you can handle it in UI if needed
  }
};
