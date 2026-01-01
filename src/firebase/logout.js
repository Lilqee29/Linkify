import { getAuth, signOut } from "firebase/auth";
import { deleteLoginCookie } from "./auth";

export const logOutUser = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        deleteLoginCookie();
        console.log("User successfully logged out");
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};
