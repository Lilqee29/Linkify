import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    sendPasswordResetEmail, 
    updatePassword, 
    sendEmailVerification,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';
import { auth } from './firebase';

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
    setLoginCookie(result.user);
    return result.user;
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
