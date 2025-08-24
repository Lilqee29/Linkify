import { doc, setDoc, getDoc, collection, serverTimestamp, updateDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Check if a username is available (not taken by another user)
export const isUsernameAvailable = async (username, excludeUserId = null) => {
  try {
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", username));
    const usernameSnapshot = await getDocs(usernameQuery);
    
    if (usernameSnapshot.empty) {
      return { available: true, message: "Username is available!" };
    }
    
    // Check if the username is taken by the same user (for updates)
    if (excludeUserId) {
      const userDoc = usernameSnapshot.docs[0];
      if (userDoc.id === excludeUserId) {
        return { available: true, message: "Username is available!" };
      }
    }
    
    return { 
      available: false, 
      message: "Username is already taken. Please choose another one." 
    };
  } catch (error) {
    console.error("Error checking username availability:", error);
    return { 
      available: false, 
      message: "Error checking username availability. Please try again." 
    };
  }
};

// Generate a unique username from email
const generateUniqueUsername = async (email) => {
  let baseUsername = email.split('@')[0];
  let username = baseUsername;
  let counter = 1;
  
  // Keep trying until we find a unique username
  while (true) {
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", username));
    const usernameSnapshot = await getDocs(usernameQuery);
    
    if (usernameSnapshot.empty) {
      // Username is unique, return it
      return username;
    }
    
    // Username exists, try with a number
    username = `${baseUsername}${counter}`;
    counter++;
    
    // Prevent infinite loops (max 100 attempts)
    if (counter > 100) {
      // Fallback: use timestamp to ensure uniqueness
      username = `${baseUsername}${Date.now().toString().slice(-4)}`;
      break;
    }
  }
  
  return username;
};

// Update user's username (with availability check)
export const updateUserUsername = async (userId, newUsername) => {
  try {
    // Check if username is available
    const availability = await isUsernameAvailable(newUsername, userId);
    
    if (!availability.available) {
      throw new Error(availability.message);
    }
    
    // Update the username
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      username: newUsername
    });
    
    console.log(`✅ Username updated to: ${newUsername}`);
    return { success: true, message: "Username updated successfully!" };
    
  } catch (error) {
    console.error("Error updating username:", error);
    throw error;
  }
};

// Create a Firestore user profile linked to Auth UID
export const createUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // Generate unique username
    const uniqueUsername = await generateUniqueUsername(user.email);
    
    // Only set defaults if the document does not exist
    await setDoc(userRef, {
      username: uniqueUsername, // Unique username
      bio: "Welcome to my links page 🚀", // default bio
      photoURL: user.photoURL || null,     // profile picture
      theme: "sunset",                     // default theme
      email: user.email,                   // auth email
      categories: ["Social", "Work", "Fun"], // default categories
      createdAt: serverTimestamp(),
    });
    
    console.log(`✅ Created user profile with unique username: ${uniqueUsername}`);
  } else {
    // If user exists but doesn't have a username, add one
    const userData = docSnap.data();
    if (!userData.username) {
      const uniqueUsername = await generateUniqueUsername(user.email);
      await updateDoc(userRef, {
        username: uniqueUsername
      });
      console.log(`✅ Updated existing user with unique username: ${uniqueUsername}`);
    }
  }
  
  // Optional: links subcollection
  // eslint-disable-next-line no-unused-vars
  const linksRef = collection(db, "users", user.uid, "links");
};

// Function to update existing users without usernames
export const updateExistingUsernames = async () => {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (!userData.username && userData.email) {
        const uniqueUsername = await generateUniqueUsername(userData.email);
        await updateDoc(doc(db, "users", userDoc.id), {
          username: uniqueUsername
        });
        console.log(`✅ Updated username for ${userData.email} to: ${uniqueUsername}`);
      }
    }
  } catch (error) {
    console.error("Error updating existing usernames:", error);
  }
};
