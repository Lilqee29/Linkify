import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { EllipsisVertical } from "lucide-react";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const UserSidebar = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState(currentUser?.displayName || currentUser?.email || "User");
  const avatarSrc = currentUser?.photoURL || null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

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
      setTimeLeft(prev => {
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
      console.log("Username updated in Firestore!");
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

  // Schedule account deletion
  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const now = Date.now();
    const expiresAt =  now + 10 * 1000; // 30 minutes

    await setDoc(userRef, { deleteRequest: { requestedAt: now, expiresAt } }, { merge: true });
    setTimeLeft(expiresAt - now);
    alert("Account deletion scheduled! You have 30 minutes to cancel.");
  };

  // Cancel deletion
  const cancelDeletion = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, { deleteRequest: null }, { merge: true });
    setTimeLeft(0);
    alert("Account deletion canceled.");
  };

  // Delete user permanently
  const deleteUserAccount = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    try {
      await deleteDoc(userRef);
      alert("Account deleted permanently!");
      // Optional: sign out user here if using Firebase auth
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Convert timeLeft to minutes:seconds format
  const formatTime = ms => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-black shadow-xl transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"} w-full sm:w-80`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-orange-500">
        <h2 className="text-xl font-bold text-white">Account</h2>
        <button onClick={onClose} className="text-white hover:text-orange-500">
          <EllipsisVertical size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[calc(100%-64px)]">
        <div className="flex flex-col items-center p-4">
          <div className="w-32 h-32 rounded-full bg-orange-500 flex items-center justify-center text-5xl font-bold text-white mb-2 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </div>

          <h1 className="text-2xl font-bold text-white">{username}</h1>

          {/* Deletion Timer */}
          {timeLeft > 0 && (
            <div className="p-2 bg-red-600 text-white rounded mt-2 flex items-center justify-between w-full">
              <span>Account will be deleted in {formatTime(timeLeft)}</span>
              <button onClick={cancelDeletion} className="ml-2 px-2 py-1 bg-gray-700 rounded">
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

            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full text-sm font-semibold transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Changing Username */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-2xl w-80 border border-orange-500">
            <h2 className="text-xl font-bold mb-4 text-white">Change Username</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                className="p-2 border border-orange-500 rounded bg-black text-white placeholder-white"
              />
              <div className="flex justify-end gap-2 mt-2">
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
        </div>
      )}
    </div>
  );
};

export default UserSidebar;
