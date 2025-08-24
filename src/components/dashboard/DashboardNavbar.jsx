import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext"; 
import { logOutUser } from "../../firebase/logout"; 
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/avatar.png"; 
import UserSidebar from "./UserSidebar"; 
import { Pencil, LogOut, HelpCircle } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore"; // use onSnapshot for live updates
import { db } from "../../firebase/firebase"; 

const DashboardNavbar = ({ onEditProfilePic }) => {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("User"); // state for username
  const navigate = useNavigate();

  // fetch username from Firestore when user logs in
useEffect(() => {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);

  // 👇 listen to live changes so it updates instantly when sidebar saves
  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      setUsername(
        data.username || 
        currentUser.displayName || 
        currentUser.email?.split("@")[0] || 
        "User"
      );
    } else {
      // fallback if no Firestore doc exists
      setUsername(
        currentUser.displayName || 
        currentUser.email?.split("@")[0] || 
        "User"
      );
    }
  });

  // cleanup listener
  return () => unsubscribe();
}, [currentUser]);


  const avatarSrc = currentUser?.photoURL || defaultAvatar; 

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logOutUser(); 
      navigate("/login"); 
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-black border-b border-neutral-800 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo / Name */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/#" className="flex items-center">
            <img className="h-8 w-8 sm:h-10 sm:w-10 mr-2" src={logo} alt="Logo" />
            <span className="text-lg sm:text-xl tracking-tight text-white font-bold">Linkly</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Username - Hide on very small screens */}
          <span className="hidden sm:block text-white font-medium">{username}</span>
          
          {/* Help Link */}
          <Link
            to="/help"
            className="flex items-center justify-center p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white"
            title="Help Center"
          >
            <HelpCircle size={16} />
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Avatar with Pencil */}
            <div className="relative">
              <button onClick={handleSidebarToggle} className="focus:outline-none">
                <img
                  src={avatarSrc}
                  alt="User Avatar"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-orange-500 hover:border-orange-400 transition cursor-pointer"
                />
              </button>
              {/* Pencil icon overlay */}
              <button
                onClick={onEditProfilePic}
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow hover:bg-orange-100"
                style={{ transform: "translate(25%, 25%)" }}
                title="Change Profile Picture"
              >
                <Pencil size={12} className="text-orange-500 sm:w-3 sm:h-3" />
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-1.5 sm:p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
              title="Log Out"
            >
              <LogOut size={14} className="text-white sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* User Sidebar */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default DashboardNavbar;
