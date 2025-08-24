import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    sendPasswordResetEmail, 
    updatePassword, 
    sendEmailVerification,
    setPersistence,
    browserLocalPersistence,
    signOut,
    
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile } from './db'; // Import Firestore profile creation

// Helper: Set cookie for 7 days
const setLoginCookie = (user) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days
    document.cookie = `linklyAuth=${user.uid}; expires=${expires.toUTCString()}; path=/`;
};

// Helper: Delete cookie
const deleteLoginCookie = () => {
    document.cookie = 'linklyAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    await setPersistence(auth, browserLocalPersistence); // Keep session across tabs
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setLoginCookie(userCredential.user);
    return userCredential;
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
    await setPersistence(auth, browserLocalPersistence); // Keep session across tabs
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setLoginCookie(userCredential.user);
    return userCredential.user;
};

// Sign in with Google
export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    // 🔹 Create Firestore profile if it doesn't exist
    await createUserProfile(user);

    // Keep session cookie
    setLoginCookie(user);

    return user;
};


// Sign out
export const doSignOut = async () => {
    await auth.signOut();
    deleteLoginCookie();
};

// Reset password
export const doPasswordReset = async (email) => {
    return sendPasswordResetEmail(auth, email);
};

// Update password
export const doPasswordUpdate = async (password) => {
    return updatePassword(auth.currentUser, password);
};

// Send email verification
export const doSendEmailVerification = async () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};

// Add this function to check email verification status
export const checkEmailVerification = async (user) => {
  try {
    // Reload user to get latest verification status
    await user.reload();
    return user.emailVerified;
  } catch (error) {
    console.error("Error checking email verification:", error);
    return false;
  }
};

// Enhanced sign in function that checks email verification
export const doSignInWithEmailAndPasswordWithVerification = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      // Sign out the user since they're not verified
      await signOut(auth);
      throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
    }
    
    return userCredential;
  } catch (error) {
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};
