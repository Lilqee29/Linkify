import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { X, HelpCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { deleteUser, updatePassword, getAuth } from "firebase/auth"; // 🔹 for auth actions
import { useAlert } from "../../contexts/AlertContext";



const UserSidebar = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState(
    currentUser?.displayName || currentUser?.email || "User"
  );
  const avatarSrc = currentUser?.photoURL || null;
  const { showAlert } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // 🔹 password change modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Fetch username and deletion request from Firestore
  useEffect(() => {
    if (!currentUser) return;
    const fetchUserData = async () => {
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.username) setUsername(data.username);

        // Check for deletion request
        if (data.deleteRequest) {
          const left = data.deleteRequest.expiresAt - Date.now();
          if (left > 0) setTimeLeft(left);
          else await deleteUserAccount();
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          deleteUserAccount(); // Delete after countdown
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Update username
  const handleSaveUsername = async () => {
    if (newUsername.trim() === "") return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { username: newUsername }, { merge: true });
      setUsername(newUsername);
      setIsModalOpen(false);
      setNewUsername("");
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

  // Schedule account deletion
  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // currently 10s for test;  30*60*1000 for 30 mins

    await setDoc(
      userRef,
      { deleteRequest: { requestedAt: now, expiresAt } },
      { merge: true }
    );
    setTimeLeft(expiresAt - now);
    showAlert("Account deletion scheduled! You have 5 minutes to cancel.", "warning");
  };

  // Cancel deletion
  const cancelDeletion = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, { deleteRequest: null }, { merge: true });
    setTimeLeft(0);
    showAlert("Account deletion canceled.", "info");
  };

  // 🔹 Delete user permanently (Firestore + Auth)
  const deleteUserAccount = async () => {
    if (!currentUser) return;

    const authInstance = getAuth();
    const user = authInstance.currentUser;

    try {
      // 1️⃣ Delete Links Subcollection
      const linksRef = collection(db, "users", currentUser.uid, "links");
      const linksSnap = await getDocs(linksRef);
      const linkDeletions = linksSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(linkDeletions);

      // 2️⃣ Delete Messages Subcollection
      const messagesRef = collection(db, "users", currentUser.uid, "messages");
      const messagesSnap = await getDocs(messagesRef);
      const messageDeletions = messagesSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(messageDeletions);

      // 3️⃣ Delete Main User Document
      const userRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userRef);

      // 4️⃣ Delete Auth account
      if (user) {
        await deleteUser(user);
        showAlert("Account and data deleted permanently! Bye-bye. 👋", "success");
        onClose(); // Close sidebar
      } else {
        showAlert("No authenticated user found to delete.", "error");
      }
    } catch (err) {
      console.error("Error deleting user data:", err);
      if (err.code === "auth/requires-recent-login") {
        showAlert("For security, you must log in again before deleting your account.", "warning");
      } else {
        showAlert("Critical failure during account deletion. Some data might remain.", "error");
      }
    }
  };


  // 🔹 Change password
  const handlePasswordChange = async () => {
    if (!newPassword) return;
    try {
      await updatePassword(currentUser, newPassword);
      showAlert("Password updated successfully!", "success");
      setIsPasswordModalOpen(false);
      setNewPassword("");
    } catch (err) {
      console.error("Error updating password:", err);
      showAlert("Failed to update password. You might need to re-login.", "error");
    }
  };

  // Convert timeLeft to minutes:seconds format
  const formatTime = (ms) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={`fixed top-0 right-0 min-h-screen bg-black shadow-xl transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"} w-full sm:w-80`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-orange-500">
        <h2 className="text-xl font-bold text-white">Account</h2>
        <button onClick={onClose} className="text-white hover:text-orange-500">
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[calc(100%-64px)]">
        <div className="flex flex-col items-center p-4">
          <div className="w-32 h-32 rounded-full bg-orange-500 flex items-center justify-center text-5xl font-bold text-white mb-2 overflow-hidden">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </div>

          <h1 className="text-2xl font-bold text-white">{username}</h1>

          {/* Deletion Timer */}
          {timeLeft > 0 && (
            <div className="p-2 bg-red-600 text-white rounded mt-2 flex items-center justify-between w-full">
              <span>Account will be deleted in {formatTime(timeLeft)}</span>
              <button
                onClick={cancelDeletion}
                className="ml-2 px-2 py-1 bg-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Account Actions */}
          <div className="flex flex-col gap-4 mt-6 w-full">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full text-sm font-semibold transition"
            >
              Change Username
            </button>

            {/* Only show password change if user signed in with email/password */}
            {currentUser?.providerData[0]?.providerId === "password" && (
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full text-sm font-semibold transition"
              >
                Change Password
              </button>
            )}

            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full text-sm font-semibold transition"
            >
              Delete Account
            </button>
            <div className="mt-8 border-t border-white/10 pt-6 space-y-3">
               <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-2">Need Help?</h4>
               <Link
                to="/help"
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition"
               >
                 <HelpCircle className="w-4 h-4 text-orange-500" /> Help Center
               </Link>
               <Link
                to="/dashboard?tour=true"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition"
               >
                 <Sparkles className="w-4 h-4 text-indigo-400" /> Start Guided Tour
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Changing Username */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-black p-6 rounded-2xl w-full max-w-sm border border-orange-500 min-h-[200px]">
            <h2 className="text-xl font-bold mb-4 text-white">
              Change Username
            </h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              className="w-full p-3 border border-orange-500 rounded bg-black text-white placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUsername}
                className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Changing Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-black p-6 rounded-2xl w-full max-w-sm border border-blue-500 min-h-[200px]">
            <h2 className="text-xl font-bold mb-4 text-white">
              Change Password
            </h2>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-3 border border-blue-500 rounded bg-black text-white placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSidebar;
