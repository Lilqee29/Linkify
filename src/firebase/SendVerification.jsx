import { sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase";

export const sendVerification = async (user) => {
  try {
    const baseUrl = import.meta.env.VITE_APP_URL || "https://linkify-ruby.vercel.app";
    
    const actionCodeSettings = {
      // 🔹 Uses Vercel production URL with ?t= timestamp for 15-minute expiration
      url: `${baseUrl}/verify-email?t=${Date.now()}`, 
      handleCodeInApp: true, 
      iOS: {
        bundleId: import.meta.env.VITE_APP_BUNDLE_ID || "com.linkly.app"
      },
      android: {
        packageName: import.meta.env.VITE_APP_PACKAGE_NAME || "com.linkly.app",
        installApp: true,
        minimumVersion: '12'
      }
    };

    await sendEmailVerification(user, actionCodeSettings);
    
    // Return success for better error handling
    return { success: true, message: "Verification email sent successfully!" };
  } catch (error) {
    console.error("Error sending email verification:", error);
    
    // Return specific error messages for better user experience
    let errorMessage = "Failed to send verification email.";
    
    switch (error.code) {
      case 'auth/too-many-requests':
        errorMessage = "Too many verification requests. Please wait a few minutes before trying again.";
        break;
      case 'auth/invalid-email':
        errorMessage = "Invalid email address.";
        break;
      case 'auth/user-not-found':
        errorMessage = "User not found.";
        break;
      case 'auth/network-request-failed':
        errorMessage = "Network error. Please check your internet connection.";
        break;
      default:
        errorMessage = `Verification failed: ${error.message}`;
    }
    
    return { success: false, error: errorMessage };
  }
};
