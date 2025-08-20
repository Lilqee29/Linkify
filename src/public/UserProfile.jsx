import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Share,
  EllipsisVertical,
} from "lucide-react";

// Map icon type to components
const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  default: LinkIcon,
};

const UserProfile = () => {
  const { username } = useParams();
  const location = useLocation();
  const links = location.state?.links || [];
  const quickLinks = links.slice(0, 3);

  const bio = "Welcome to my links page 🚀"; // Static bio
  const profilePic = null; // Optional profile picture

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${username}'s Links`,
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-200 flex items-center justify-center p-4">
      <div className="bg-yellow-600 w-full max-w-sm rounded-3xl shadow-lg overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b border-yellow-500">
          <Link to="/" className="flex items-center">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
          </Link>
          <button onClick={handleShare}>
            <Share className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center p-6">
          <div className="w-32 h-32 mb-4 rounded-full bg-yellow-800 flex items-center justify-center text-5xl font-bold text-black overflow-hidden">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </div>

          <h1 className="text-3xl font-bold text-black">{username}</h1>
          <p className="text-black mt-1 text-center">{bio}</p>

          {/* Quick Links */}
          <div className="flex gap-4 mt-4 mb-6">
            {quickLinks.map((link) => {
              const Icon = iconMap[link.iconType] || LinkIcon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-700 p-3 rounded-full hover:bg-yellow-800 transition flex items-center justify-center"
                >
                  <Icon className="w-5 h-5 text-black" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col gap-4 px-4 pb-6">
          {links.length === 0 ? (
            <p className="text-center text-black/70">No links available.</p>
          ) : (
            links.map((link) => {
              const Icon = iconMap[link.iconType] || LinkIcon;
              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between bg-yellow-700 hover:bg-yellow-800 transition-colors p-4 rounded-2xl shadow-lg"
                >
                  {/* Left Icon */}
                  <div className="flex items-center gap-3 flex-1">
                    <Icon size={24} className="text-black" />
                  </div>

                  {/* Title Center */}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-black font-semibold"
                  >
                    {link.title}
                  </a>

                  {/* Right Share */}
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={() =>
                        navigator.share?.({ title: link.title, url: link.url })
                      }
                      className="p-1 rounded-full hover:bg-yellow-800 transition"
                      title="Share link"
                    >
                      <EllipsisVertical size={20} className="text-black" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Join Button */}
        <div className="px-4 pb-4">
          <Link
            to="/"
            className="w-full bg-yellow-800 hover:bg-yellow-900 text-black py-2 rounded-full text-sm font-semibold transition flex justify-center"
          >
            Join {username} on Linktree
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
