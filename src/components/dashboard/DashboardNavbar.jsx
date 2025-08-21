import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext"; // adjust path if needed
import { logOutUser } from "../../firebase/logout"; // centralized logout
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/avatar.png"; // default avatar
import UserSidebar from "./UserSidebar"; // import your sidebar
import { Pencil, LogOut } from "lucide-react";

const DashboardNavbar = ({ onEditProfilePic }) => {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const username = currentUser?.displayName || currentUser?.email || "User";
  const avatarSrc = currentUser?.photoURL || defaultAvatar; // dynamic avatar

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logOutUser(); // log out
      navigate("/login"); // redirect to login page
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
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

          <div className="flex items-center space-x-3">
            {/* User Avatar with Pencil */}
            <div className="relative">
              <button onClick={handleSidebarToggle} className="focus:outline-none">
                <img
                  src={avatarSrc}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-orange-500 hover:border-orange-400 transition cursor-pointer"
                />
              </button>
              {/* Pencil icon overlay */}
              <button
                onClick={onEditProfilePic}
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow hover:bg-orange-100"
                style={{ transform: "translate(25%, 25%)" }}
                title="Change Profile Picture"
              >
                <Pencil size={14} className="text-orange-500" />
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
              title="Log Out"
            >
              <LogOut size={16} className="text-white" />
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
