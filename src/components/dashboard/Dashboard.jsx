import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { PlusCircle, Eye, Edit2, Trash2, X, User, Image as ImageIcon, Palette, Pi, Share, MessageSquare, Trash, BarChart3, Sparkles, Zap, Clock, Calendar, Send, Activity, Camera } from "lucide-react";
import { Helmet } from "react-helmet-async";
import DashboardNavbar from "./DashboardNavbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useDashboardLinks } from "../../firebase/Dashboardlink";
import { useDashboardProfile } from "../../firebase/Dashboardbio";
import { useDashboardProfilePic } from "../../firebase/DashboardprofilePic";
import { useDashboardTheme } from "../../firebase/useDashboardtheme";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useDashboardMessages } from "../../firebase/DashboardMessages";
import { useAlert } from "../../contexts/AlertContext";
import Onboarding from "./Onboarding";



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
  pinterest: FaPinterest,
  tiktok: FaTiktok,
  snapchat: FaSnapchat,
  reddit: FaReddit,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
};

const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser, updateProfile, loading } = useAuth(); // Assume useAuth returns loading
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const { showAlert } = useAlert();

   if (loading) {
     return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">Loading...</div>;
   }

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
          const fallbackUsername = currentUser.displayName || currentUser.email?.split("@")[0] || "User";
          setUsername(fallbackUsername);
        }
      } else {
        // 🔹 If no doc, still use Google/displayName or email
        const fallbackUsername = currentUser.displayName || currentUser.email?.split("@")[0] || "User";
        setUsername(fallbackUsername);
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
  const [formData, setFormData] = useState({ 
    title: "", 
    url: "", 
    iconType: "default", 
    iconUrl: "", 
    category: categories[0],
    isFeatured: false,
    isActive: true,
    scheduledStart: "",
    scheduledEnd: ""
  });

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  // Auto-detect icon and fetch metadata
  useEffect(() => {
    if (!formData.url || editLink) return;
    
    // Icon Detection logic remains...
    const url = formData.url.toLowerCase();
    let detectedIcon = "default";
    
    if (url.includes("instagram.com")) detectedIcon = "instagram";
    else if (url.includes("youtube.com") || url.includes("youtu.be")) detectedIcon = "youtube";
    else if (url.includes("twitter.com") || url.includes("x.com")) detectedIcon = "twitter";
    else if (url.includes("facebook.com") || url.includes("fb.com")) detectedIcon = "facebook";
    else if (url.includes("github.com")) detectedIcon = "github";
    else if (url.includes("discord.gg") || url.includes("discord.com")) detectedIcon = "discord";
    else if (url.includes("pinterest.com")) detectedIcon = "pinterest";
    else if (url.includes("tiktok.com")) detectedIcon = "tiktok";
    else if (url.includes("snapchat.com")) detectedIcon = "snapchat";
    else if (url.includes("reddit.com")) detectedIcon = "reddit";
    else if (url.includes("whatsapp.com") || url.includes("wa.me")) detectedIcon = "whatsapp";
    else if (url.includes("t.me") || url.includes("telegram.org")) detectedIcon = "telegram";
    
    if (detectedIcon !== "default" && formData.iconType === "default") {
      setFormData(prev => ({ ...prev, iconType: detectedIcon }));
    }
  }, [formData.url, editLink]);

  const handleFetchMetadata = async () => {
    if (!formData.url) return;
    setIsFetchingMetadata(true);
    
    let url = formData.url;
    if (!url.startsWith('http')) url = 'https://' + url;
    
    try {
      // Use Microlink for rich metadata
      const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      
      if (data.status === 'success' && data.data) {
        const { title, logo, image } = data.data;
        const iconUrl = logo?.url || image?.url || `https://unavatar.io/${new URL(url).hostname}?fallback=https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
        
        setFormData(prev => ({ 
          ...prev, 
          title: prev.title || title || "", 
          iconUrl: iconUrl,
          iconType: (logo || image) ? "custom" : prev.iconType
        }));
        showAlert("Link metadata optimized! ✨", "success");
      } else {
        handleFetchMagicIcon(); // fallback to basic icon scrape
      }
    } catch (e) {
      handleFetchMagicIcon();
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleFetchMagicIcon = () => {
    if (!formData.url) return;
    
    let url = formData.url;
    if (!url.startsWith('http')) url = 'https://' + url;
    
    try {
      const hostname = new URL(url).hostname;
      // Try to get avatar or favicon
      const magicUrl = `https://unavatar.io/${hostname}?fallback=https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
      setFormData(prev => ({ ...prev, iconType: "custom", iconUrl: magicUrl }));
      showAlert("Magic icon applied! ✨", "success");
    } catch (e) {
      showAlert("Invalid URL for magic icon", "error");
    }
  };

  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [profilePicModalOpen, setProfilePicModalOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  const { bio, amaEnabled, handleSaveProfile, loading: bioLoading } = useDashboardProfile(); 
  const [tempBio, setTempBio] = useState(bio); // Local state for editing

  // Update tempBio when bio loads from db
  useEffect(() => { 
    setTempBio(bio); 
    setTempUsername(username);
  }, [bio, username]);

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
  //   primaryColor: "#6366F1", 
  //   secondaryColor: "#22D3EE",
  //   backgroundColor: "#0F172A",
  //   textColor: "#F8FAFC",
  //   fontFamily: "'Inter', sans-serif"
  // });
  
  // Guard against undefined customTheme
  const safeCustomTheme = customTheme || {
        primaryColor: "#6366f1", // Indigo 500
        secondaryColor: "#818cf8", // Indigo 400
        backgroundColor: "#000000", // Pure Black
        textColor: "#ffffff",
        fontFamily: "'Inter', sans-serif"
  };

  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const { messages, loading: messagesLoading, handleDeleteMessage } = useDashboardMessages();
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const location = useLocation();

  // Check for onboarding
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const hasOnboarded = localStorage.getItem('linkly_onboarded');
    const forceTour = queryParams.get('tour') === 'true';

    if (forceTour || !hasOnboarded) {
      setTimeout(() => setOnboardingOpen(true), 1500);
      // Clean up URL
      if (forceTour) {
         navigate(location.pathname, { replace: true });
      }
    }
  }, [location]);

  // Analytics calculations
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const topLinks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 3);
  const maxClicks = Math.max(...links.map(l => l.clicks || 0), 1);
  // // Example of improved default and preset themes for clarity and text emphasis:
  function getContrastColor(bgColor) {
    if (!bgColor) return "#111111";
    const color = bgColor.replace("#", "");
    const r = parseInt(color.substr(0,2),16);
    const g = parseInt(color.substr(2,2),16);
    const b = parseInt(color.substr(4,2),16);
    const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
    return luminance > 0.6 ? "#111111" : "#ffffff";
  }

  const isLinkVisible = (link) => {
    if (link.isActive === false) return false;
    const now = new Date();
    if (link.scheduledStart && new Date(link.scheduledStart) > now) return false;
    if (link.scheduledEnd && new Date(link.scheduledEnd) < now) return false;
    return true;
  };

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
    setFormData({ 
      title: "", 
      url: "", 
      iconType: "default", 
      iconUrl: "", 
      category: categories[0],
      isFeatured: false,
      isActive: true,
      scheduledStart: "",
      scheduledEnd: ""
    });
    setModalOpen(true);
  };

  const handleEditLink = (link) => {
    setEditLink(link);
    setFormData({ 
      title: link.title, 
      url: link.url, 
      iconType: link.iconType || "default", 
      iconUrl: link.iconUrl || "",
      category: link.category || categories[0],
      isFeatured: link.isFeatured || false,
      isActive: link.isActive !== undefined ? link.isActive : true,
      scheduledStart: link.scheduledStart || "",
      scheduledEnd: link.scheduledEnd || ""
    });
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
    const themeData = currentTheme === 'custom' ? safeCustomTheme : predefinedThemes[currentTheme];
    navigate(`/profile/${username}`, { 
      state: { 
        links, 
        bio, 
        profilePic,
        theme: themeData
      } 
    });
  };

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/${username}`;
    
    if (navigator.share) {
      // Use native sharing if available
      navigator.share({
        title: `${username}'s Links`,
        text: `Check out ${username}'s links on Linkly!`,
        url: publicUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(publicUrl).then(() => {
        showAlert("Link copied to clipboard! 📋 Share this link with others to show them your profile.", "success");
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = publicUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showAlert("Link copied to clipboard! 📋 Share this link with others to show them your profile.", "success");
      });
    }
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
    <div className="min-h-screen lg:min-h-[100dvh] bg-[#0f0f11] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <Helmet>
        <title>Editor | Linkify</title>
      </Helmet>
      {/* Navbar with subtle translucency */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/5">
         <DashboardNavbar />
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Editor Controls */}
        <div className="flex-1 space-y-8">
           
           {/* Header Area */}
           <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-neutral-400">Manage your links and appearance.</p>
           </div>

           {/* Quick Actions Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleAddLink}
                className="col-span-2 py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
              >
                <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Add Link
              </button>
              
              <button
                onClick={() => setThemeModalOpen(true)}
                className="py-3.5 sm:py-4 px-2 sm:px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] transition-all font-semibold flex flex-col items-center justify-center gap-1 hover:text-indigo-400"
              >
                 <Palette className="w-5 h-5" /> <span className="text-xs">Appearance</span>
              </button>

              <button
                onClick={handleShare}
                className="py-3.5 sm:py-4 px-2 sm:px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] transition-all font-semibold flex flex-col items-center justify-center gap-1 hover:text-green-400"
              >
                 <Share className="w-5 h-5" /> <span className="text-xs">Share</span>
              </button>

              <button
                 onClick={() => setMessagesModalOpen(true)}
                 className="py-3.5 sm:py-4 px-2 sm:px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] transition-all font-semibold flex flex-col items-center justify-center gap-1 hover:text-pink-400 relative"
               >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Messages</span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 rounded-full ${amaEnabled ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-900/50 text-neutral-500'}`}>
                    {amaEnabled ? 'Active' : 'Hidden'}
                  </span>
                  {messages.length > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-neutral-900 shadow-lg"></span>
                  )}
               </button>

              <button
                 onClick={() => setAnalyticsModalOpen(true)}
                 className="py-3.5 sm:py-4 px-2 sm:px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] transition-all font-semibold flex flex-col items-center justify-center gap-1 hover:text-blue-400 relative"
               >
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs">Analytics</span>
               </button>
           </div>

           {/* Profile Card (Mini) */}
             <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-3xl flex items-center gap-6 group/profile">
               <div className="relative group cursor-pointer shrink-0" onClick={() => setProfilePicModalOpen(true)}>
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-neutral-800 group-hover:border-indigo-500 transition-all duration-300 shadow-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-neutral-800 group-hover:border-indigo-500 transition-all duration-300 bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                     <Camera className="w-6 h-6 text-white transform scale-75 group-hover:scale-100 transition-transform" />
                  </div>
                  {/* Minimal Floating Camera Icon */}
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full border-2 border-[#0f0f11] flex items-center justify-center shadow-lg z-20">
                     <Camera size={12} className="text-white" />
                  </div>
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold truncate">{username}</h2>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20 animate-pulse">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      Live
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 line-clamp-2">{bio || "Add a bio to tell the world about yourself."}</p>
                  <button onClick={() => setBioModalOpen(true)} className="text-xs text-indigo-400 font-bold mt-2 hover:text-indigo-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/5 rounded-lg border border-indigo-500/10 active:scale-95">
                    <Edit2 size={12} /> Edit Profile
                  </button>
               </div>
            </div>

           {/* Links Manager */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Your Links</h3>
                <span className="text-xs font-mono bg-neutral-800 px-2 py-1 rounded text-neutral-400">{links.length} Links</span>
              </div>
              
              {allCategories.map(category => {
                 const catLinks = groupedLinks[category];
                 if (catLinks.length === 0) return null;

                 return (
                  <div key={category} className="space-y-3">
                    <h4 className="text-sm uppercase tracking-widest font-bold text-neutral-500 pl-1">{category || "Uncategorized"}</h4>
                    <div className="grid gap-3">
                      {catLinks.map((link) => {
                        const Icon = iconMap[link.iconType] || LinkIcon;
                        return (
                          <div
                            key={link.id}
                            className="group flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-neutral-800/40 border border-white/5 hover:border-indigo-500/30 hover:bg-neutral-800 transition-all cursor-move"
                          >
                             <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                               <div className="relative shrink-0">
                                 <div className="p-3 bg-neutral-900 rounded-xl text-neutral-400 group-hover:text-white transition-colors overflow-hidden">
                                    {link.iconType === "custom" ? (
                                      <img src={link.iconUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                      (() => {
                                        const Icon = iconMap[link.iconType] || LinkIcon;
                                        return <Icon className="w-5 h-5" />;
                                      })()
                                    )}
                                 </div>
                                 {link.isFeatured && (
                                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-neutral-800 animate-pulse"></div>
                                 )}
                               </div>
                               <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold truncate group-hover:text-indigo-400 transition-colors">{link.title}</h4>
                                    {link.isFeatured && <Zap className="w-3 h-3 text-indigo-400 fill-current" />}
                                    {(link.scheduledStart || link.scheduledEnd) && <Clock className="w-3 h-3 text-neutral-500" />}
                                  </div>
                                  <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 truncate hover:underline">{link.url}</a>
                               </div>
                             </div>
                            
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity sm:translate-x-4 group-hover:translate-x-0">
                               <button 
                                 onClick={() => handleEditLink(link)} 
                                 className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition"
                               >
                                 <Edit2 className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleDeleteLink(link.id)} 
                                 className="p-2 hover:bg-red-500/10 rounded-lg text-neutral-400 hover:text-red-500 transition"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                 );
              })}
              
              {links.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-neutral-800 rounded-3xl">
                   <p className="text-neutral-500">You haven't added any links yet.</p>
                   <button onClick={handleAddLink} className="text-indigo-400 font-bold mt-2 hover:underline">Get started</button>
                </div>
              )}
           </div>
        </div>

        {/* Right Column: Sticky Phone Preview */}
        <div className="hidden lg:block w-[400px] shrink-0">
           <div className="sticky top-24">
              <div className="text-center mb-4">
                 <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Live Preview</span>
              </div>
              
              {/* Phone Mockup Reused Logic but positioned in the grid */}
              <div className="relative w-[320px] h-[640px] mx-auto border-[14px] border-neutral-900 rounded-[3rem] shadow-2xl bg-neutral-900 overflow-hidden ring-1 ring-white/10">
                 {/* Notch */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[28px] w-[120px] bg-black rounded-b-[1.2rem] z-20 flex justify-center items-center">
                    <div className="w-16 h-1.5 bg-neutral-800/50 rounded-full"></div>
                 </div>

                 {/* Screen */}
                 <div 
                    className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center pt-12 pb-8 px-5 relative transition-colors duration-500"
                    style={{
                      backgroundColor: safeCustomTheme.backgroundColor,
                      fontFamily: safeCustomTheme.fontFamily,
                      color: safeCustomTheme.textColor
                    }}
                  >
                      {/* Using the safeCustomTheme to render live preview content */}
                      {/* Profile Pic */}
                      <div className="relative mb-6 z-10">
                        <div className="w-24 h-24 rounded-full border-4 shadow-xl flex items-center justify-center text-4xl font-bold overflow-hidden bg-neutral-100"
                           style={{
                             borderColor: safeCustomTheme.primaryColor,
                           }}
                        >
                          {profilePic ? (
                            <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div style={{ color: safeCustomTheme.primaryColor }}>U</div>
                          )}
                        </div>
                      </div>

                      <div className="text-center w-full z-10 mb-8 space-y-2">
                        <h1 className="text-xl font-bold tracking-tight">@{username}</h1>
                        <p className="text-sm opacity-80 leading-relaxed line-clamp-3">
                          {bio || "Your bio will appear here..."}
                        </p>
                      </div>

                      {/* Preview AMA */}
                      {amaEnabled && (
                        <div className="w-full max-w-sm mb-8 z-10">
                          <div className="relative">
                            <div 
                              className="w-full pl-10 pr-12 py-3 rounded-2xl border-none shadow-lg bg-white/10 backdrop-blur-md text-xs opacity-60"
                              style={{ color: safeCustomTheme.textColor }}
                            >
                              Ask me anything...
                            </div>
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                               <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                               <Send className="w-4 h-4 cursor-default" />
                            </div>
                          </div>
                   </div>
                   )}



                       <div className="w-full flex flex-col gap-3 z-10 pb-10">
                        {links.filter(isLinkVisible).length === 0 ? (
                           <div className="w-full py-4 text-center opacity-50 border border-dashed border-current rounded-xl">No active links</div>
                        ) : (
                           links.filter(isLinkVisible).map((link) => {
                             const Icon = iconMap[link.iconType] || LinkIcon;
                             const isTrending = link.clicks >= maxClicks && maxClicks > 0;
                             return (
                               <div
                                key={link.id}
                                className={`relative flex items-center justify-between px-4 py-3.5 rounded-xl shadow-sm transition-all w-full text-left font-medium ${link.isFeatured ? 'animate-pulse scale-[1.02] ring-2 ring-white/20' : ''}`}
                                style={{
                                  backgroundColor: safeCustomTheme.primaryColor,
                                  color: safeCustomTheme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff",
                                  opacity: 0.9,
                                  border: link.isFeatured ? `2px solid ${safeCustomTheme.secondaryColor}` : 'none'
                                }}
                              >
                                <span className="flex items-center gap-3">
                                  {link.iconType === "custom" ? (
                                    <img src={link.iconUrl} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                                  ) : (
                                    <Icon className="w-4 h-4 shrink-0" />
                                  )}
                                  <span className="truncate max-w-[150px]">{link.title}</span>
                                </span>
                                {isTrending && <Zap className="w-3 h-3 animate-bounce" />}
                              </div>
                             );
                           })
                        )}
                      </div>
                  </div>
              </div>

              <div className="text-center mt-6">
                 <button 
                  onClick={handlePreview} 
                  className="px-6 py-2.5 rounded-full border border-white/20 text-sm font-semibold text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 mx-auto active:scale-95 shadow-lg shadow-black/20"
                >
                    <Eye className="w-4 h-4" /> View Live Page
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* ------------------- Messages Modal ------------------- */}
      {messagesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-4 sm:p-8 rounded-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
            <button 
              onClick={() => setMessagesModalOpen(false)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-neutral-400 hover:text-orange-500 transition-all"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-2">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <MessageSquare className="text-indigo-500" /> Inbox <span className="text-sm opacity-40 font-bold">({messages.length})</span>
                </h2>
                
                <div className="flex items-center gap-3 bg-neutral-800 px-4 py-2 rounded-full border border-white/5 self-start">
                   <span className="text-[10px] font-black uppercase tracking-[0.1em] text-neutral-400">AMA</span>
                   <button 
                     onClick={() => handleSaveProfile({ amaEnabled: !amaEnabled })}
                     className={`w-8 h-4 rounded-full transition-colors relative ${amaEnabled ? 'bg-orange-500' : 'bg-neutral-600'}`}
                   >
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${amaEnabled ? 'left-4.5' : 'left-0.5'}`} style={{ left: amaEnabled ? '1.125rem' : '0.125rem' }}></div>
                   </button>
                </div>
            </div>
            
            <div className="space-y-4">
              {messagesLoading ? (
                <div className="text-center opacity-50 py-10">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center opacity-50 py-10 border border-dashed border-white/10 rounded-xl">
                  No messages yet. <br />
                  <span className="text-xs">Share your link to get questions!</span>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="bg-neutral-800/50 p-4 rounded-xl border border-white/5 relative group">
                    <p className="text-sm text-neutral-200 mb-2 leading-relaxed">"{msg.text}"</p>
                    <div className="flex items-center justify-between mt-2 opacity-50 text-xs">
                       <span>{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                       <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded transition"
                       >
                         <Trash className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- Analytics Modal ------------------- */}
      {analyticsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
            <button onClick={() => setAnalyticsModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-orange-500">
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 /> Analytics
            </h2>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-white/5">
                <div className="text-3xl font-bold">{links.length}</div>
                <div className="text-xs opacity-50 mt-1">Total Links</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-white/5">
                <div className="text-3xl font-bold">{totalClicks}</div>
                <div className="text-xs opacity-50 mt-1">Total Clicks</div>
              </div>
            </div>

            {/* Top Links */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold opacity-50 mb-3">🏆 TOP PERFORMING LINKS</h3>
              <div className="space-y-3">
                {topLinks.length === 0 ? (
                  <div className="text-center opacity-50 py-6 border border-dashed border-white/10 rounded-xl text-sm">
                    No clicks yet. Share your link!
                  </div>
                ) : (
                  topLinks.map((link, idx) => {
                    const Icon = iconMap[link.iconType] || LinkIcon;
                    const percentage = maxClicks > 0 ? ((link.clicks || 0) / maxClicks) * 100 : 0;
                    return (
                      <div key={link.id} className="bg-neutral-800/50 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium truncate max-w-[120px]">{link.title}</span>
                          </div>
                          <span className="text-sm font-bold">{link.clicks || 0}</span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* All Links */}
            <div>
              <h3 className="text-sm font-semibold opacity-50 mb-3">📊 ALL LINKS</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {links.map(link => {
                  const Icon = iconMap[link.iconType] || LinkIcon;
                  return (
                    <div key={link.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-800/50 transition">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 opacity-50" />
                        <span className="text-sm truncate max-w-[150px]">{link.title}</span>
                      </div>
                      <span className="text-sm font-semibold opacity-75">{link.clicks || 0} clicks</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- Bio Modal ------------------- */}
      {bioModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
            <button onClick={() => setBioModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-orange-500">
              <X />
            </button>
            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest ml-1">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">@</span>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-neutral-800 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-500 outline-none border border-white/5 transition-all"
                    placeholder="yourname"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 ml-1">This will be your link: linkify.com/{tempUsername || 'username'}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest ml-1">Bio / Tagline</label>
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full p-4 rounded-xl bg-neutral-800 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-500 outline-none border border-white/5 transition-all min-h-[120px]"
                  placeholder="Tell the world about yourself..."
                />
              </div>
            </div>
            {/* Removed toggle from here as it's now in the Inbox modal */}

            <button
               onClick={async () => {
                await handleSaveProfile({ 
                  bio: tempBio,
                  username: tempUsername 
                }); // save to Firestore
                setBioModalOpen(false); // close modal
              }} 
              disabled={bioLoading}
              className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                  bioLoading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20"
              }`}
            >
              {bioLoading ? "Updating Profile..." : <><Activity className="w-5 h-5" /> Save Changes</>}
            </button>
          </div>
        </div>
      )}

      

      {/* ------------------- Profile Pic Modal ------------------- */}
      {profilePicModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button 
                onClick={() => {
                  setProfilePicModalOpen(false);
                  setOnboardingOpen(true);
                }}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                Need help?
              </button>
              <button
                onClick={() => setProfilePicModalOpen(false)}
                className="text-neutral-400 hover:text-orange-500"
              >
                <X />
              </button>
            </div>

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
          <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
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
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="URL"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="flex-1 p-3 rounded-lg bg-neutral-800 text-white placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={handleFetchMetadata}
                  disabled={isFetchingMetadata}
                  title="Optimize with AI"
                  className="px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center group disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 group-hover:scale-110 transition-transform ${isFetchingMetadata ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Special Features Settings */}
              <div className="bg-neutral-800/50 p-4 rounded-xl space-y-4 border border-white/5">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Zap className={`w-4 h-4 ${formData.isFeatured ? 'text-indigo-400' : 'text-neutral-500'}`} />
                       <span className="text-sm font-semibold">Spotlight Link</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                      className={`w-10 h-5 rounded-full transition-colors relative ${formData.isFeatured ? 'bg-indigo-600' : 'bg-neutral-700'}`}
                    >
                       <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.isFeatured ? 'left-6' : 'left-1'}`}></div>
                    </button>
                 </div>

                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-400 mb-2">
                       <Clock className="w-4 h-4" />
                       <span className="text-xs font-bold uppercase tracking-wider">Scheduled Visibility</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1">
                          <label className="text-[10px] uppercase text-neutral-500 font-bold ml-1">Start Date</label>
                          <input 
                            type="datetime-local" 
                            value={formData.scheduledStart}
                            onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg bg-neutral-900 text-white border border-white/5"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] uppercase text-neutral-500 font-bold ml-1">End Date</label>
                          <input 
                            type="datetime-local" 
                            value={formData.scheduledEnd}
                            onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg bg-neutral-900 text-white border border-white/5"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Visual Icon Selector */}
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Select Icon</div>
              <div className="grid grid-cols-7 gap-2 mb-4 bg-neutral-800 p-3 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, iconType: "default", iconUrl: "" })}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${formData.iconType === "default" ? "bg-indigo-600 text-white" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-700 hover:text-white"}`}
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
                {Object.entries(iconMap).filter(([key]) => key !== 'default').map(([key, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, iconType: key, iconUrl: "" })}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${formData.iconType === key ? "bg-indigo-600 text-white" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-700 hover:text-white"}`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
                {formData.iconUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, iconType: "custom" })}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${formData.iconType === "custom" ? "bg-indigo-600 text-white" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-700 hover:text-white"}`}
                  >
                    <img src={formData.iconUrl} className="w-5 h-5 rounded-full object-cover" />
                  </button>
                )}
              </div>
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
          <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto custom-scrollbar mx-4">
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
                    fontFamily: safeCustomTheme.fontFamily,
                  }}
                >
                  <span
                    className="mb-2 block w-6 h-6 rounded-full border"
                    style={{ backgroundColor: safeCustomTheme.primaryColor, borderColor: safeCustomTheme.secondaryColor }}
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
                        value={safeCustomTheme[key]}
                        onChange={(e) => setCustomTheme({ [key]: e.target.value, ...(key === "backgroundColor" ? { textColor: getContrastColor(e.target.value) } : {}) })}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={safeCustomTheme[key]}
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
                value={safeCustomTheme.fontFamily}
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
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: safeCustomTheme.backgroundColor }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: safeCustomTheme.textColor, fontFamily: safeCustomTheme.fontFamily }}>
                  Theme Preview
                </h3>
                <div className="flex gap-2 mb-2">
                  <button className="px-3 py-1 rounded" style={{ backgroundColor: safeCustomTheme.primaryColor, color: safeCustomTheme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff" }}>Primary Button</button>
                  <button className="px-3 py-1 rounded" style={{ backgroundColor: safeCustomTheme.secondaryColor, color: safeCustomTheme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff" }}>Secondary Button</button>
                </div>
                <p style={{ color: safeCustomTheme.textColor, fontFamily: safeCustomTheme.fontFamily }}>This is how your text will look with the selected theme.</p>
              </div>

              {/* Save Button */}
              <button
                onClick={async () => {
                  try {
                    await handleSaveTheme();
                  } catch (err) {
                    console.error("Error saving theme:", err);
                  }
                  setThemeModalOpen(false);
                }}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                style={{
                  backgroundColor: safeCustomTheme.primaryColor,
                  color: safeCustomTheme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff",
                }}
              >
                <Palette /> Save Theme
              </button>
              {/* ------------------- Theme Card Preview ------------------- */}
            <div className="mb-6 mt-12 flex justify-center">
              {/* Phone Mockup Container */}
              <div className="relative w-full max-w-[280px] sm:w-[300px] h-[520px] sm:h-[600px] border-[10px] sm:border-[14px] border-neutral-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl bg-neutral-900 overflow-hidden ring-2 sm:ring-4 ring-neutral-800 mx-auto">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[24px] w-[100px] bg-black rounded-b-[1rem] z-20 flex justify-center items-center">
                   <div className="w-12 h-1 bg-neutral-800 rounded-full opacity-30"></div>
                </div>

                {/* Screen Content */}
                <div 
                  className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center pt-10 pb-6 px-4 relative transition-colors duration-500"
                  style={{
                    backgroundColor: safeCustomTheme.backgroundColor,
                    fontFamily: safeCustomTheme.fontFamily,
                    color: safeCustomTheme.textColor
                  }}
                >
                    {/* Decorative Background Elem (if needed) */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-b from-white/10 to-transparent"></div>

                    {/* Profile Pic */}
                    <div className="relative mb-4 z-10 group">
                      <div className="absolute inset-0 rounded-full blur-md opacity-50 animate-pulse" style={{ backgroundColor: safeCustomTheme.primaryColor }}></div>
                      <div
                        className="w-24 h-24 rounded-full border-4 shadow-xl flex items-center justify-center text-4xl font-bold overflow-hidden relative z-10"
                        style={{
                          borderColor: safeCustomTheme.primaryColor,
                          backgroundColor: safeCustomTheme.backgroundColor === "#ffffff" ? "#f3f4f6" : "#262626",
                          color: safeCustomTheme.primaryColor
                        }}
                      >
                        {profilePic ? (
                          <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          "U"
                        )}
                      </div>
                    </div>

                    {/* Username & Bio */}
                    <div className="text-center w-full z-10 mb-6">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-sm" style={{ backgroundColor: safeCustomTheme.primaryColor + '30', color: safeCustomTheme.primaryColor }}>
                         @{username}
                      </div>
                      <h1 className="text-xl font-bold mb-1 tracking-tight" style={{ color: safeCustomTheme.textColor }}>
                         {bio ? "My Links" : "Welcome"}
                      </h1>
                       <p className="text-sm opacity-80 px-2 line-clamp-3 leading-relaxed" style={{ color: safeCustomTheme.textColor }}>
                        {bio || "This is a preview of your bio. It looks great!"}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="w-full flex flex-col gap-3 z-10">
                      {[1, 2].map((_, i) => (
                        <div
                          key={i}
                          className="relative group w-full"
                        >
                           <div className="absolute inset-0 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" style={{ backgroundColor: safeCustomTheme.primaryColor }}></div>
                           <button
                            className="relative flex items-center justify-between px-4 py-3.5 rounded-xl shadow-md transition-all duration-300 w-full text-left font-medium active:scale-95 hover:-translate-y-0.5"
                            style={{
                              background: safeCustomTheme.primaryColor,
                              color: safeCustomTheme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff", // Dynamic contrast for buttons
                              border: `1px solid ${safeCustomTheme.secondaryColor}40`
                            }}
                        >
                          <span className="flex items-center gap-3">
                            <LinkIcon className="w-5 h-5 opacity-80" />
                            {i === 0 ? "My Portfolio" : "Instagram"}
                          </span>
                           <Share className="w-4 h-4 opacity-50" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Footer Branding */}
                  <div className="mt-auto pt-8 opacity-40 text-[10px] font-bold tracking-widest uppercase">
                    Linkify
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- Onboarding Modal ------------------- */}
      <Onboarding isOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </div>
  );
};



export default Dashboard;
