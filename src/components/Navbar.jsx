import { Menu, X, Pencil, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { navItems } from "../constants";
import { useAuth } from "../contexts/authContext";
import { logOutUser } from "../firebase/logout";

// eslint-disable-next-line no-unused-vars
const Navbar = ({ onEditProfilePic }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { currentUser } = useAuth();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  const username = currentUser?.displayName || currentUser?.email || "User";
  const avatarSrc = currentUser?.photoURL || "/default-avatar.png";

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/#" className="flex items-center">
              <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
              <span className="text-xl tracking-tight">Linkly</span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          {/* User Info or Sign In / Create Account */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Avatar + Pencil */}
                <div className="relative">
                  <img
                    src={avatarSrc}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border-2 border-orange-500 hover:border-orange-400 transition cursor-pointer"
                  />
                </div>
                <span className="text-white font-medium">{username}</span>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
                  title="Log Out"
                >
                  <LogOut size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 px-3 border rounded-md hover:bg-gray-100 transition duration-300"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md text-white hover:opacity-90 transition duration-300"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <Link to={item.href} className="hover:text-indigo-400 transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6 mt-6">
              {currentUser ? (
                <>
                  <img
                    src={avatarSrc}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border-2 border-orange-500"
                  />
                  <span className="text-white">{username}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-2 rounded-full bg-red-600 hover:bg-red-700 transition"
                  >
                    <LogOut size={16} className="text-white" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-2 px-3 border rounded-md">
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800"
                  >
                    Create an account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
