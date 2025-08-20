import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { PlusCircle, Eye, Edit2, Trash2, X, User, Image as ImageIcon } from "lucide-react";
import DashboardNavbar from "./DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Social Icons
import { Instagram, Youtube, Twitter, Facebook, Link as LinkIcon } from "lucide-react";

const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  default: LinkIcon,
};

const Dashboard = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const username =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  // ------------------- State -------------------
  const [links, setLinks] = useState([
    { id: 1, title: "Instagram", url: "https://instagram.com", iconType: "instagram" },
    { id: 2, title: "YouTube", url: "https://youtube.com", iconType: "youtube" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editLink, setEditLink] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "", iconType: "default" });

  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [profilePicModalOpen, setProfilePicModalOpen] = useState(false);

  const [bio, setBio] = useState(currentUser?.bio || "");
  const [profilePic, setProfilePic] = useState(currentUser?.photoURL || "");
  const [profileFile, setProfileFile] = useState(null);

  // ------------------- Link Handlers -------------------
  const handleAddLink = () => {
    setEditLink(null);
    setFormData({ title: "", url: "", iconType: "default" });
    setModalOpen(true);
  };

  const handleEditLink = (link) => {
    setEditLink(link);
    setFormData({ title: link.title, url: link.url, iconType: link.iconType || "default" });
    setModalOpen(true);
  };

  const handleDeleteLink = (id) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setLinks(links.filter((link) => link.id !== id));
    }
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return alert("Title & URL are required!");
    if (editLink) {
      setLinks(links.map((link) => (link.id === editLink.id ? { ...link, ...formData } : link)));
    } else {
      setLinks([...links, { id: Date.now(), ...formData }]);
    }
    setModalOpen(false);
  };

  const handlePreview = () => {
    navigate(`/profile/${username}`, { state: { links, bio, profilePic } });
  };

  // ------------------- Bio Save -------------------
  const handleSaveBio = async () => {
    try {
      setBioModalOpen(false); // close modal
      // just update state immediately
      setBio(bio);
      await updateProfile(currentUser, { displayName: username });
      alert("Bio updated ✅");
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  // ------------------- Profile Pic Upload + Save -------------------
  const handleSaveProfilePic = async () => {
    try {
      if (profileFile) {
        const storage = getStorage();
        const fileRef = ref(storage, `profilePics/${currentUser.uid}.jpg`);
        await uploadBytes(fileRef, profileFile);
        const url = await getDownloadURL(fileRef);
        setProfilePic(url);
        await updateProfile(currentUser, { photoURL: url });
      }
      setProfilePicModalOpen(false);
      alert("Profile picture updated ✅");
    } catch (error) {
      console.error("Error updating profile pic:", error);
    }
  };

  // ------------------- JSX -------------------
  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-10">
          Welcome {username}, manage your profile 🚀
        </h1>

        {/* Profile Preview */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 mb-3"
          />
          <p className="text-neutral-300">{bio || "No bio yet."}</p>
        </div>

        {/* Profile Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => setProfilePicModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-orange-500 text-black font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition"
          >
            <User /> Change Profile Picture
          </button>
          <button
            onClick={() => setBioModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-orange-500 text-black font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition"
          >
            <Edit2 /> Edit Bio
          </button>
          <button
            onClick={handleAddLink}
            className="flex items-center justify-center gap-2 bg-orange-500 text-black font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition"
          >
            <PlusCircle /> Add New Link
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center justify-center gap-2 bg-transparent border border-orange-500 text-orange-500 font-bold py-3 px-6 rounded-xl hover:bg-orange-500 hover:text-black transition"
          >
            <Eye /> Preview Links
          </button>
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-4">
          {links.length === 0 ? (
            <p className="text-center text-neutral-400">No links added yet.</p>
          ) : (
            links.map((link) => {
              const Icon = iconMap[link.iconType] || LinkIcon;
              return (
                <div
                  key={link.id}
                  className="flex justify-between items-center w-full bg-gradient-to-r from-orange-400 to-red-500 hover:scale-105 transition-transform p-4 rounded-xl"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 font-bold text-white"
                  >
                    <Icon /> {link.title}
                  </a>
                  <div className="flex gap-3">
                    <button onClick={() => handleEditLink(link)} className="text-white hover:text-black transition">
                      <Edit2 />
                    </button>
                    <button onClick={() => handleDeleteLink(link.id)} className="text-white hover:text-red-500 transition">
                      <Trash2 />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ------------------- Bio Modal ------------------- */}
      {bioModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-11/12 max-w-md relative">
            <button onClick={() => setBioModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-orange-500">
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Edit2 /> Edit Bio
            </h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-lg bg-neutral-800 text-white placeholder:text-neutral-400"
              rows={5}
            />
            <button
              onClick={handleSaveBio}
              className="mt-4 w-full bg-orange-500 text-black font-bold py-3 rounded-xl hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <Edit2 /> Save Bio
            </button>
          </div>
        </div>
      )}

      {/* ------------------- Profile Pic Modal ------------------- */}
      {profilePicModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-11/12 max-w-md relative">
            <button onClick={() => setProfilePicModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-orange-500">
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon /> Change Profile Picture
            </h2>

            {/* File upload only */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileFile(e.target.files[0])}
              className="mb-3 w-full text-white"
            />

            <button
              onClick={handleSaveProfilePic}
              className="mt-4 w-full bg-orange-500 text-black font-bold py-3 rounded-xl hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <User /> Save Picture
            </button>
          </div>
        </div>
      )}

      {/* ------------------- Add/Edit Link Modal ------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-11/12 max-w-md relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-orange-500">
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <PlusCircle /> {editLink ? "Edit Link" : "Add New Link"}
            </h2>
            <form onSubmit={handleLinkSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 rounded-lg bg-neutral-800 text-white placeholder:text-neutral-400"
              />
              <input
                type="url"
                placeholder="URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full p-3 rounded-lg bg-neutral-800 text-white placeholder:text-neutral-400"
              />
              <select
                value={formData.iconType}
                onChange={(e) => setFormData({ ...formData, iconType: e.target.value })}
                className="w-full p-3 rounded-lg bg-neutral-800 text-white"
              >
                <option value="default">Default</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
              </select>
              <button
                type="submit"
                className="mt-2 w-full bg-orange-500 text-black font-bold py-3 rounded-xl hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                <PlusCircle /> Save Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
