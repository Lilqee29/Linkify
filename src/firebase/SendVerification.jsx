import { sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase"; // adjust path if needed

export const sendVerification = async (user) => {
  try {
    await sendEmailVerification(user, {
      url: "http://localhost:5173/login", // where user should go after verifying
      handleCodeInApp: true,
    });
    console.log("Verification email sent!");
  } catch (error) {
    console.error("Error sending email verification:", error);
  }
};
