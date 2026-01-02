import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { navItems } from "../constants";
import { useAuth } from "../contexts/authContext";
import { logOutUser } from "../firebase/logout";
import { useAlert } from "../contexts/AlertContext";

// eslint-disable-next-line no-unused-vars
const Navbar = ({ onEditProfilePic }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { currentUser } = useAuth();
  const { showAlert } = useAlert();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (err) {
      showAlert("Logout failed: " + err.message, "error");
    }
  };

  const username = currentUser?.displayName || currentUser?.email || "User";
  const avatarSrc = currentUser?.photoURL || "/default-avatar.png";

  return (
    <nav className="sticky top-0 z-50 py-3 bg-black border-b border-neutral-700 lg:backdrop-blur-lg lg:bg-black/95">
      <div className="container px-4 mx-auto relative">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/#" className="flex items-center">
              <img className="h-20 w-20 sm:h-24 sm:w-24 mr-3 object-contain" src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.href} 
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Info or Sign In / Create Account */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Avatar */}
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
                  className="py-2 px-4 border border-white/20 rounded-md text-white hover:bg-neutral-800 transition duration-300 font-medium"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-orange-500 to-orange-700 py-2 px-4 rounded-md text-white hover:from-orange-600 hover:to-orange-800 transition duration-300 font-medium"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleNavbar}
              className="p-2 text-white hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/80 z-40"
              onClick={() => setMobileDrawerOpen(false)}
            />
            
            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-black border-l border-neutral-800 z-50 transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button 
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-2 text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-6">
                  <ul className="space-y-4">
                    {navItems.map((item, index) => (
                      <li key={index}>
                        <Link 
                          to={item.href} 
                          className="block py-3 px-4 text-white hover:bg-neutral-800 rounded-lg transition-colors font-medium"
                          onClick={() => setMobileDrawerOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* User Section */}
                <div className="p-6 border-t border-neutral-800">
                  {currentUser ? (
                    <div className="space-y-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 p-4 bg-neutral-900 rounded-lg">
                        <img
                          src={avatarSrc}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full border-2 border-orange-500"
                        />
                        <div>
                          <p className="text-white font-semibold">{username}</p>
                          <p className="text-gray-400 text-sm">Logged in</p>
                        </div>
                      </div>
                      
                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileDrawerOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className="block w-full py-3 px-4 text-center border border-neutral-700 text-white hover:bg-neutral-800 rounded-lg transition-colors font-medium"
                        onClick={() => setMobileDrawerOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full py-3 px-4 text-center bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800 rounded-lg transition-colors font-medium"
                        onClick={() => setMobileDrawerOpen(false)}
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
