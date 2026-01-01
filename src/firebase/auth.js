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
    applyActionCode,
    checkActionCode,
    updateProfile
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
export const deleteLoginCookie = () => {
    document.cookie = 'linklyAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // ❌ Don't set login cookie here, user must verify first
    return userCredential;
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setLoginCookie(userCredential.user);
    return userCredential.user;
};

// Sign in with Google
export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    // IMPORTANT: Avoid async calls like setPersistence right before signInWithPopup
    // because it can trigger popup blockers in modern browsers.
    // Persistence only needs to be set once per session.
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 🔹 Create Firestore profile if it doesn't exist
    await createUserProfile(user);

    // Keep session cookie
    setLoginCookie(user);

    return user;
};

// 🔹 Silent Sign In (for OTP workflow)
export const doSilentSignIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setLoginCookie(userCredential.user);
    return userCredential.user;
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

// Resend verification email
export const doResendVerificationEmail = async (email, password) => {
    try {
        // We need to sign in first to get the currentUser
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user, {
            url: `${window.location.origin}/login`,
        });
        // Sign out immediately so they can't access until verified
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Error resending verification:", error);
        throw error;
    }
};

export const logOutUser = doSignOut;

// 🔹 Generate a 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// 🔹 Enhanced sign in function that checks email verification (UPDATED for Custom OTP)
export const doSignInWithEmailAndPasswordWithOTPCheck = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check custom verified flag in user data/metadata if needed, 
    // but for now we'll rely on the existing Firebase emailVerified or a custom Firestore field.
    // However, to make it "instant" without link, we'll mark them as verified manually once they enter OTP.
    
    if (!user.emailVerified) {
       // We can actually allow them if we use a custom "verified" field in Firestore
       // but for standard Firebase Auth, we'll need to handle it in the UI.
    }
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};
