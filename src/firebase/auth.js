import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    sendPasswordResetEmail, 
    updatePassword, 
    sendEmailVerification 
} from 'firebase/auth';
import { auth } from './firebase';

// Create a new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google
export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // This forces Google to always ask which account to use
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    return result.user;
};

// Sign out
export const doSignOut = async () => {
    return auth.signOut();
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
        url: `${window.location.origin}/home`, // change to your desired redirect URL
    });
};
