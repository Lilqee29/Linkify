import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { PlusCircle, Eye, Edit2, Trash2, X, User, Image as ImageIcon, Palette, Pi } from "lucide-react";
import DashboardNavbar from "./DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { useDashboardLinks } from "../../firebase/Dashboardlink"; // adjust path
import { useDashboardProfile } from "../../firebase/Dashboardbio"; // adjust path
import { useDashboardProfilePic } from "../../firebase/DashboardprofilePic"; // adjust path
import { useDashboardTheme } from "../../firebase/useDashboardtheme"; // adjust path
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";



// Social Icons
import { FaDiscord, FaPinterest,FaReddit,FaSnapchat,FaTelegram,FaTiktok,FaWhatsapp} from "react-icons/fa";
import { Instagram, Youtube, Twitter, Facebook,Github, Link as LinkIcon } from "lucide-react";

const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  github: Github,
  default: LinkIcon,
  discord: FaDiscord,
  Pinterest: FaPinterest,
  tiktok: FaTiktok,
  snapchat: FaSnapchat,
  reddit: FaReddit,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,

};

const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
   const [username, setUsername] = useState("User");

useEffect(() => {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);

  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data.username) {
        // 🔹 Firestore username takes priority
        setUsername(data.username);
      } else {
        // 🔹 fallback to Google/displayName or email
        setUsername(
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "User"
        );
      }
    } else {
      // 🔹 If no doc, still use Google/displayName or email
      setUsername(
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        "User"
      );
    }
  });

  return () => unsubscribe();
}, [currentUser]);




  // const username =
  //   currentUser?.displayName ||
  //   currentUser?.email?.split("@")[0] ||
  //   "User";

  // ------------------- State -------------------
 
  const { links, categories,setCategories, newCategory, setNewCategory, handleLinkSubmit, handleDeleteLink } = useDashboardLinks();

  // const [categories, setCategories] = useState(["Social", "Work", "Fun"]);
  // const [links, setLinks] = useState([]);
  // const [newCategory, setNewCategory] = useState(""); // to type a new category
  // // const [selectedCategory, setSelectedCategory] = useState(""); // dropdown selection


  const [modalOpen, setModalOpen] = useState(false);
  const [editLink, setEditLink] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "", iconType: "default", category: categories[0] });

  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [profilePicModalOpen, setProfilePicModalOpen] = useState(false);

  const { bio, setBio, handleSaveBio } = useDashboardProfile();

  const { profilePic,profileFile, setProfileFile, handleSaveProfilePic } = useDashboardProfilePic();

const saveProfilePic = async () => {
  if (!profileFile) return; // nothing selected
  await handleSaveProfilePic(); // uses profileFile from hook
  setProfileFile(null); // reset the selected file
  setProfilePicModalOpen(false); // close modal
};
 const {
    currentTheme,
    setCurrentTheme,
    customTheme,
    setCustomTheme,
    predefinedThemes,
    handleSaveTheme
  } = useDashboardTheme();

  const [themeModalOpen, setThemeModalOpen] = useState(false);



  // ------------------- Theme State -------------------
  // const [themeModalOpen, setThemeModalOpen] = useState(false);
  // const [currentTheme, setCurrentTheme] = useState(currentUser?.theme || "default");
  // const [customTheme, setCustomTheme] = useState({
  //   primaryColor: "#6366F1",   // Indigo-500 (modern Linktree-like accent)
  //   secondaryColor: "#22D3EE", // Cyan-400 (fresh + lively highlight)
  //   backgroundColor: "#0F172A", // Slate-900 (deep navy, softer than pure black)
  //   textColor: "#F8FAFC",      // Slate-50 (off-white, easy on the eyes)
  //   fontFamily: "'Inter', sans-serif"
  // });
  // // Example of improved default and preset themes for clarity and text emphasis:
// Helper function to calculate best text color
  function getContrastColor(bgColor) {
    if (!bgColor) return "#111111";
    const color = bgColor.replace("#", "");
    const r = parseInt(color.substr(0,2),16);
    const g = parseInt(color.substr(2,2),16);
    const b = parseInt(color.substr(4,2),16);
    const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
    return luminance > 0.6 ? "#111111" : "#ffffff";
  }

  // const predefinedThemes = {
  //   classic: {
  //     primaryColor: "#a78bfa", // Lavender
  //     secondaryColor: "#f472b6", // Pink
  //     backgroundColor: "#0f0f0f", // Dark
  //     textColor: getContrastColor("#0f0f0f"),
  //     fontFamily: "'Inter', sans-serif"
  //   },
  //   ocean: {
  //     primaryColor: "#38bdf8", // Bright sky blue
  //     secondaryColor: "#0ea5e9", // Deep cyan
  //     backgroundColor: "#082f49", // Navy teal
  //     textColor: getContrastColor("#082f49"),
  //     fontFamily: "'Inter', sans-serif"
  //   },
  //   forest: {
  //     primaryColor: "#34d399", // Emerald green
  //     secondaryColor: "#059669", // Darker green
  //     backgroundColor: "#064e3b", // Dark forest
  //     textColor: getContrastColor("#fdf4ff"),
  //     fontFamily: "'Inter', sans-serif"
  //   },
  //   sunset: {
  //     primaryColor: "#f59e0b", // Amber
  //     secondaryColor: "#ef4444", // Strong red-orange
  //     backgroundColor: "#7c2d12", // Burnt orange
  //     textColor: "#111827",
  //     fontFamily: "'Inter', sans-serif"
  //   },
  //   cartoon: {
  //     primaryColor: "#ec4899", // Hot pink
  //     secondaryColor: "#8b5cf6", // Violet
  //     backgroundColor: "#fdf4ff", // Light background
  //     textColor: getContrastColor("#fdf4ff"),
  //     fontFamily: "'Comic Neue', cursive"
  //   },
  //   playful: {
  //     primaryColor: "#f43f5e", // Rose
  //     secondaryColor: "#3b82f6", // Blue
  //     backgroundColor: "#fdf2f8", // Light pink
  //     textColor: getContrastColor("#fdf2f8"),
  //     fontFamily: "'Bubblegum Sans', cursive"
  //   }
  // };

  // Load theme on component mount
  useEffect(() => {
    // If user has a saved theme, load it
    if (currentUser?.theme && predefinedThemes[currentUser.theme]) {
      setCurrentTheme(currentUser.theme);
      setCustomTheme(predefinedThemes[currentUser.theme]);
    } else if (currentUser?.customTheme) {
      // If user has a custom theme
      setCurrentTheme("custom");
      setCustomTheme(currentUser.customTheme);
    }
  }, [currentUser]);

  // ------------------- Link Handlers -------------------
  const handleAddLink = () => {
    setEditLink(null);
    setFormData({ title: "", url: "", iconType: "default", category: categories[0] });
    setModalOpen(true);
  };

  const handleEditLink = (link) => {
    setEditLink(link);
    setFormData({ title: link.title, url: link.url, iconType: link.iconType || "default", category: link.category || categories[0] });
    setModalOpen(true);
  };

  // const handleDeleteLink = (id) => {
  //   if (window.confirm("Are you sure you want to delete this link?")) {
  //     setLinks(links.filter((link) => link.id !== id));
  //   }
  // };

  // const handleLinkSubmit = (e) => {
  //   e.preventDefault();
  //   if (!formData.title || !formData.url) return alert("Title & URL are required!");
  //   if (editLink) {
  //     setLinks(links.map((link) => (link.id === editLink.id ? { ...link, ...formData } : link)));
  //   } else {
  //     setLinks([...links, { id: Date.now(), ...formData }]);
  //   }
  //   setModalOpen(false);
  // };

  const handlePreview = () => {
    // If using a custom theme, pass customTheme, else pass the selected predefined theme
    const themeData = currentTheme === 'custom' ? customTheme : predefinedThemes[currentTheme];
    navigate(`/profile/${username}`, { 
      state: { 
        links, 
        bio, 
        profilePic,
        theme: themeData
      } 
    });
  };

  // ------------------- Bio Save -------------------
  // const handleSaveBio = async () => {
  //   try {
  //     setBioModalOpen(false); // close modal
  //     // just update state immediately
  //     setBio(bio);
  //     await updateProfile(currentUser, { displayName: username });
  //     alert("Bio updated ✅");
  //   } catch (error) {
  //     console.error("Error updating bio:", error);
  //   }
  // };

  // ------------------- Profile Pic Upload + Save -------------------
  // const handleSaveProfilePic = async () => {
  //   try {
  //     if (profileFile) {
  //       // Close the modal immediately
  //       setProfilePicModalOpen(false);

  //       // Upload the file to ImgBB
  //       const uploadToImgBB = async (file) => {
  //         const formData = new FormData();
  //         formData.append("image", file);
  //         const res = await fetch(
  //           "https://api.imgbb.com/1/upload?key=10aed3e501f26e66f261b55cd07d72c6",
  //           {
  //             method: "POST",
  //             body: formData,
  //           }
  //         );
  //         const data = await res.json();
  //         return data.data.url; // direct link to uploaded image
  //       };

  //       const url = await uploadToImgBB(profileFile);
        
  //       setProfilePic(url); // update state
  //       await updateProfile(currentUser, { photoURL: url }); // update Firebase user profile

  //       alert("Profile picture updated ✅");
  //       // Optional: remove reload if you want it fully reactive
  //       // window.location.reload();
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile pic:", error);
  //   }
  // };


  
  // ------------------- Theme Save -------------------
useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  const savedCustomTheme = localStorage.getItem("customTheme");

  if (savedTheme) {
    setCurrentTheme(savedTheme);
    if (savedTheme === "custom" && savedCustomTheme) {
      setCustomTheme(JSON.parse(savedCustomTheme));
    }
  }
}, []);


//   const handleSaveTheme = async () => {
//   try {
//     if (currentTheme !== "custom") {
//       // Update in backend
//       await updateProfile(currentUser, { theme: currentTheme });

//       // Save in localStorage
//       localStorage.setItem("theme", currentTheme);

//       // Reset customTheme in localStorage
//       localStorage.removeItem("customTheme");
//     } else {
//       // Update in backend
//       await updateProfile(currentUser, { 
//         theme: "custom", 
//         customTheme: customTheme 
//       });

//       // Save custom theme in localStorage
//       localStorage.setItem("theme", "custom");
//       localStorage.setItem("customTheme", JSON.stringify(customTheme));
//     }

//     // Update state
//     setCurrentTheme(currentTheme);
//     setCustomTheme(customTheme);

//   } catch (error) {
//     console.error("Error updating theme:", error);
//   } finally {
//     setThemeModalOpen(false);
//   }
// };


  const allCategories = ["None", ...categories];
  const groupedLinks = allCategories.reduce((acc, cat) => {
    if (cat === "None") {
      acc[cat] = links.filter(link => !link.category || link.category === "");
    } else {
      acc[cat] = links.filter(link => link.category === cat);
    }
    return acc;
  }, {});

  // ------------------- JSX -------------------
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <DashboardNavbar onEditProfilePic={() => setProfilePicModalOpen(true)} />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-orange-500">
          Welcome {username}, manage your profile 🚀
        </h1>

        {/* Profile Preview */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-3 border-4 border-orange-500"
          />
          <p>{bio || "No bio yet."}</p>
        </div>

        {/* Profile Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => setProfilePicModalOpen(true)}
            className="flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition bg-orange-500 text-black"
          >
            <User /> Change Profile Picture
          </button>
          <button
            onClick={() => setBioModalOpen(true)}
            className="flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition bg-orange-500 text-black"
          >
            <Edit2 /> Edit Bio
          </button>
          <button
            onClick={handleAddLink}
            className="flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition bg-orange-500 text-black"
          >
            <PlusCircle /> Add New Link
          </button>
          <button
            onClick={() => setThemeModalOpen(true)}
            className="flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition bg-orange-500 text-black"
          >
            <Palette /> Customize Theme
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition border border-orange-500 text-orange-500 bg-transparent"
          >
            <Eye /> Preview Links
          </button>
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-6">
          {allCategories.map(category => (
            <div key={category}>
              <h2 className="text-xl font-bold mb-2 text-orange-400">
               {!category ? "Other" : category}
              </h2>
              <div className="flex flex-col gap-2">
                {groupedLinks[category].length === 0 ? (
                  <p className="text-neutral-400 text-sm">No links in this category.</p>
                ) : (
                  groupedLinks[category].map((link) => {
                    const Icon = iconMap[link.iconType] || LinkIcon;
                    return (
                      <div
                        key={link.id}
                        className="flex justify-between items-center w-full hover:scale-105 transition-transform p-4 rounded-xl bg-neutral-800"
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
                          <button 
                            onClick={() => handleEditLink(link)} 
                            className="transition text-white"
                          >
                            <Edit2 />
                          </button>
                          <button 
                            onClick={() => handleDeleteLink(link.id)} 
                            className="hover:text-red-500 transition text-white"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
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
               onClick={() => {
                handleSaveBio(bio); // save to Firestore
                setBioModalOpen(false); // close modal
              }} // pass the actual string, not the event
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
            <button
              onClick={() => setProfilePicModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-orange-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon /> Change Profile Picture
            </h2>

            <div className="flex flex-col items-center gap-4">
              {/* Preview selected image */}
              <div className="w-32 h-32 rounded-full border-4 border-orange-400 overflow-hidden flex items-center justify-center bg-neutral-200">
                {profileFile ? (
                  <img
                    src={URL.createObjectURL(profileFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profilePic ? (
                  <img
                    src={profilePic}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-neutral-400">?</span>
                )}
              </div>

              {/* Choose photo button */}
              <label className="px-4 py-2 rounded-full bg-orange-500 text-white font-semibold cursor-pointer hover:bg-orange-600 transition">
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setProfileFile(e.target.files[0])} // sets the file correctly
                />
              </label>

              {/* Save button */}
            <button
              onClick={saveProfilePic}
              className="mt-2 px-4 py-2 rounded-full bg-black text-white font-semibold hover:bg-neutral-800 transition"
              disabled={!profileFile}
            >
              Save
            </button>

            </div>
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
           <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLinkSubmit(formData, editLink, setModalOpen);
                }}
                className="flex flex-col gap-3"
            >
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
                <option value="discord">Discord</option>
                <option value="pinterest">Pinterest</option>
                <option value="github">Github</option>
                <option value="tiktok">TikTok</option>
                <option value="snapchat">Snapchat</option>
                <option value="pinterest">Pinterest</option>
                <option value="reddit">Reddit</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
              </select>
              {/* Category Select */}
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-lg bg-neutral-800 text-white"
              >
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Add new category */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-neutral-800 text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                  if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                    setCategories([...categories, newCategory.trim()]);
                    setFormData({ ...formData, category: newCategory.trim() });
                    setNewCategory("");
                  }
                  }}
                  className="bg-orange-500 px-3 rounded-lg text-black font-bold hover:bg-orange-600"
                >
                  Add
                </button>
              </div>

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
      
      {/* ------------------- Theme Selection Modal ------------------- */}
      {themeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-11/12 max-w-md relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setThemeModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-orange-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Palette /> Customize Theme
            </h2>

            {/* Predefined Themes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Choose a Theme</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  key="none"
                  onClick={() => setCustomTheme({})} // triggers custom mode
                  className={`p-3 rounded-lg flex flex-col items-center transition-all border ${
                    currentTheme === "custom" ? "ring-2 ring-black scale-105 border-black" : "border-neutral-300 hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: "#fff",
                    color: "#222",
                    fontWeight: 600,
                    fontFamily: customTheme.fontFamily,
                  }}
                >
                  <span
                    className="mb-2 block w-6 h-6 rounded-full border"
                    style={{ backgroundColor: customTheme.primaryColor, borderColor: customTheme.secondaryColor }}
                  ></span>
                  <span>None (Custom)</span>
                </button>

                {Object.entries(predefinedThemes).map(([themeName, theme]) => (
                  <button
                    key={themeName}
                    onClick={() => {
                      setCurrentTheme(themeName);
                      setCustomTheme(theme);
                    }}
                    className={`p-3 rounded-lg flex flex-col items-center transition-all border ${
                      currentTheme === themeName ? "ring-2 ring-black scale-105 border-black" : "border-neutral-300 hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: "#fff",
                      color: "#222",
                      fontWeight: 600,
                      fontFamily: theme.fontFamily,
                    }}
                  >
                    <span
                      className="mb-2 block w-6 h-6 rounded-full border"
                      style={{ backgroundColor: theme.primaryColor, borderColor: theme.secondaryColor }}
                    ></span>
                    <span className="capitalize">{themeName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Theme */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Customize Colors</h3>
              <div className="flex flex-col gap-3">
                {["primaryColor", "secondaryColor", "backgroundColor", "textColor"].map((key) => (
                  <div key={key}>
                    <label className="block text-sm mb-1">{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customTheme[key]}
                        onChange={(e) => setCustomTheme({ [key]: e.target.value, ...(key === "backgroundColor" ? { textColor: getContrastColor(e.target.value) } : {}) })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme[key]}
                        onChange={(e) => setCustomTheme({ [key]: e.target.value, ...(key === "backgroundColor" ? { textColor: getContrastColor(e.target.value) } : {}) })}
                        className="flex-1 p-2 rounded-lg bg-neutral-800 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Font Family</h3>
              <select
                value={customTheme.fontFamily}
                onChange={(e) => setCustomTheme({ fontFamily: e.target.value })}
                className="w-full p-3 rounded-lg bg-neutral-800 text-white"
              >
                <option value="'Inter', sans-serif">Inter (Default)</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Montserrat', sans-serif">Montserrat</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Comic Neue', cursive">Comic Neue</option>
                <option value="'Bubblegum Sans', cursive">Bubblegum Sans</option>
                <option value="'Fredoka One', cursive">Fredoka One</option>
                <option value="'Bangers', cursive">Bangers</option>
                <option value="'Architects Daughter', cursive">Architects Daughter</option>
              </select>
            </div>

            {/* Preview */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: customTheme.backgroundColor }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: customTheme.textColor, fontFamily: customTheme.fontFamily }}>
                Theme Preview
              </h3>
              <div className="flex gap-2 mb-2">
                <button className="px-3 py-1 rounded" style={{ backgroundColor: customTheme.primaryColor, color: customTheme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff" }}>Primary Button</button>
                <button className="px-3 py-1 rounded" style={{ backgroundColor: customTheme.secondaryColor, color: customTheme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff" }}>Secondary Button</button>
              </div>
              <p style={{ color: customTheme.textColor, fontFamily: customTheme.fontFamily }}>This is how your text will look with the selected theme.</p>
            </div>

            {/* Save Button */}
            <button
              onClick={async () => {
                console.log("Save button clicked");
                try {
                  await handleSaveTheme();
                  console.log("Theme saved successfully!");
                } catch (err) {
                  console.error("Error saving theme:", err);
                }
                setThemeModalOpen(false);
                console.log("themeModalOpen after closing:", themeModalOpen);
              }}
              className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              style={{
                backgroundColor: customTheme.primaryColor,
                color: customTheme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff",
              }}
            >
              <Palette /> Save Theme
            </button>
            {/* ------------------- Theme Card Preview ------------------- */}
          <div className="mb-6 mt-12 flex justify-center">
            <div
              className="w-full max-w-xs bg-white/90 rounded-3xl shadow-2xl flex flex-col items-center relative"
              style={{
                border: `2px solid ${customTheme.primaryColor}`,
                boxShadow: `0 8px 32px 0 ${customTheme.primaryColor}33`,
              }}
            >
              {/* Profile Pic - Overlapping */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div
                  className="w-20 h-20 rounded-full border-4 shadow-lg flex items-center justify-center text-3xl font-bold overflow-hidden"
                  style={{
                    background: customTheme.primaryColor,
                    color: customTheme.backgroundColor,
                    borderColor: customTheme.secondaryColor,
                  }}
                >
                  U
                </div>
              </div>
              <div className="pt-14 pb-4 px-4 w-full flex flex-col items-center">
                <div
                  className="text-base font-semibold mb-1"
                  style={{ color: customTheme.primaryColor }}
                >
                  Good Afternoon, welcome to my page 👋
                </div>
                <h1
                  className="text-lg font-bold mb-1"
                  style={{ color: customTheme.textColor }}
                >
                  Username
                </h1>
                <p
                  className="text-center mb-3"
                  style={{ color: customTheme.textColor, opacity: 0.8 }}
                >
                  This is a bio preview.
                </p>
                <div className="w-full flex flex-col gap-2">
                  <button
                    className="flex items-center gap-3 font-bold px-4 py-3 rounded-full shadow transition w-full text-left text-base"
                    style={{
                      background: customTheme.primaryColor,
                      color: customTheme.backgroundColor,
                      fontFamily: customTheme.fontFamily,
                    }}
                  >
                    <LinkIcon /> Example Link
                  </button>
                  <button
                    className="flex items-center gap-3 font-bold px-4 py-3 rounded-full shadow transition w-full text-left text-base"
                    style={{
                      background: customTheme.primaryColor,
                      color: customTheme.backgroundColor,
                      fontFamily: customTheme.fontFamily,
                    }}
                  >
                    <LinkIcon /> Another Link
                  </button>
                </div>
              </div>
            </div>
          </div>

          </div>
        </div>
      )}

    </div>
    
  );
};



export default Dashboard;
