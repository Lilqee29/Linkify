import { sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase";

export const sendVerification = async (user) => {
  try {
    const actionCodeSettings = {
      url: window.location.origin + "/login", // Dynamic URL based on current domain
      handleCodeInApp: true,
      // Set verification link to expire in 2 minutes (120 seconds)
      // Note: Firebase minimum is 1 hour, but we can handle this in our logic
      iOS: {
        bundleId: 'com.linkly.app'
      },
      android: {
        packageName: 'com.linkly.app',
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
