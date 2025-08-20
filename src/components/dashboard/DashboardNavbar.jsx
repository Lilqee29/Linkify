import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext"; // adjust path if needed
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/avatar.png"; // default avatar
import { Link } from "react-router-dom";
import UserSidebar from "./UserSidebar"; // import your sidebar

const DashboardNavbar = () => {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const username = currentUser?.displayName || currentUser?.email || "User";
  const avatarSrc = currentUser?.photoURL || defaultAvatar; // dynamic avatar

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-black border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        {/* Logo / Name */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/#" className="flex items-center">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight text-white">Linkly</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          <span className="text-white font-medium">{username}</span>
          <button onClick={handleSidebarToggle} className="focus:outline-none">
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-orange-500 hover:border-orange-400 transition cursor-pointer"
            />
          </button>
        </div>
      </nav>

      {/* User Sidebar */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default DashboardNavbar;
