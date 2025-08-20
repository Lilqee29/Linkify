import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Link as LinkIcon,
  EllipsisVertical,
} from "lucide-react";

const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  default: LinkIcon,
};

const UserSidebar = ({ isOpen, onClose }) => {
  const { username } = useParams();
  const location = useLocation();
  const initialLinks = location.state?.links || [];

  const [links] = useState(initialLinks);
  const [bio, setBio] = useState("Welcome to my links page 🚀");
  const [profilePic, setProfilePic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const quickLinks = links.slice(0, 3);

  const handleShare = (title, url) => {
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (newBio, newProfilePic) => {
    setBio(newBio);
    if (newProfilePic) setProfilePic(newProfilePic);
    setIsModalOpen(false);
  };

  const renderLinkButton = (link) => {
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
  };

  const renderLinkItem = (link) => {
    const Icon = iconMap[link.iconType] || LinkIcon;
    return (
      <div
        key={link.id}
        className="flex items-center justify-between bg-yellow-700 hover:bg-yellow-800 transition-colors p-4 rounded-2xl shadow-lg"
      >
        <div className="flex items-center gap-3 flex-1">
          <Icon size={24} className="text-black" />
        </div>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-black font-semibold"
        >
          {link.title || "Untitled"}
        </a>

        <div className="flex-1 flex justify-end">
          <button
            onClick={() => handleShare(link.title, link.url)}
            className="p-1 rounded-full hover:bg-yellow-800 transition"
            title="Share link"
          >
            <EllipsisVertical size={20} className="text-black" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-yellow-100 shadow-xl transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"} w-full sm:w-80`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-300">
        <h2 className="text-xl font-bold text-black">Profile</h2>
        <button onClick={onClose} className="text-black hover:text-red-500">
          <EllipsisVertical size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[calc(100%-64px)]">
        {/* Profile Section */}
        <div className="flex flex-col items-center p-4">
          <div className="w-32 h-32 rounded-full bg-yellow-800 flex items-center justify-center text-5xl font-bold text-black overflow-hidden mb-2">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              username?.charAt(0).toUpperCase() || "?"
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-black/70 underline mb-2"
          >
            Edit Profile
          </button>

          <h1 className="text-2xl font-bold text-black">{username || "Guest"}</h1>
          <p className="text-black mt-1 text-center">{bio}</p>

          {/* Quick Links */}
          <div className="flex gap-4 mt-4 mb-6">{quickLinks.map(renderLinkButton)}</div>

          {/* All Links */}
          <div className="flex flex-col gap-4 w-full">
            {links.length === 0
              ? <p className="text-center text-black/70">No links available.</p>
              : links.map(renderLinkItem)}
          </div>

          {/* Join Button */}
          <div className="px-4 pb-4 w-full">
            <Link
              to="/#"
              className="w-full bg-yellow-800 hover:bg-yellow-900 text-black py-2 rounded-full text-sm font-semibold transition flex justify-center"
            >
              Join {username || "Guest"} on Linktree
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-yellow-100 p-6 rounded-2xl w-80">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter your bio"
                className="p-2 border border-yellow-300 rounded"
              />
              <input type="file" onChange={handleProfilePicChange} />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(bio, profilePic)}
                  className="px-4 py-2 rounded bg-yellow-800 text-black hover:bg-yellow-900"
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
