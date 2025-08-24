// src/public/PublicProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaDiscord, FaPinterest, FaReddit, FaSnapchat, FaTelegram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { Instagram, Youtube, Twitter, Facebook, Github, Link as LinkIcon, Share } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Map icon type to components
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

const PublicProfile = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localLinks, setLocalLinks] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Query all users to find the one with matching username
        const usersRef = collection(db, "users");
        const usernameQuery = query(usersRef, where("username", "==", username));
        const usernameSnapshot = await getDocs(usernameQuery);
        
        if (!usernameSnapshot.empty) {
          const userDoc = usernameSnapshot.docs[0];
          const userData = userDoc.data();
          const userId = userDoc.id;
          
          // Get the user's links from the links subcollection
          const linksRef = collection(db, "users", userId, "links");
          const linksSnapshot = await getDocs(linksRef);
          const userLinks = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          const profileData = {
            username: username,
            links: userLinks || [],
            bio: userData.bio || "Welcome to my links page 🚀",
            profilePic: userData.photoURL || null,
            theme: userData.customTheme || {
              primaryColor: "#2563eb",
              secondaryColor: "#10b981",
              backgroundColor: "#f3f4f6",
              textColor: "#111827",
              fontFamily: "'Inter', sans-serif"
            }
          };
          
          setProfileData(profileData);
          setLocalLinks(userLinks || []);
        } else {
          setError("Username not found");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]);

  // Add Google Fonts
  useEffect(() => {
    if (!document.getElementById('google-fonts-public')) {
      const link = document.createElement('link');
      link.id = 'google-fonts-public';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Comic+Neue&family=Bubblegum+Sans&family=Fredoka+One&family=Bangers&family=Architects+Daughter&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Profile not found"}</p>
          <p className="text-gray-600 mt-2">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { links, bio, profilePic, theme } = profileData;
  const quickLinks = links.slice(0, 3);

  const categories = [...new Set(localLinks.map(link => link.category || "None"))];
  const groupedLinks = categories.reduce((acc, cat) => {
    acc[cat] = localLinks.filter(link => (link.category || "None") === cat);
    return acc;
  }, {});
  const topLink = localLinks.reduce((max, link) => (link.clicks || 0) > (max?.clicks || 0) ? link : max, localLinks[0]);

  const handleLinkClick = (id, url) => {
    setLocalLinks(prev =>
      prev.map(link => link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link)
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${username}'s Links`,
        text: `Check out ${username}'s links on Linkly!`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard! 📋");
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard! 📋");
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-2 py-4 sm:px-6 sm:py-12" style={{ background: theme.backgroundColor, fontFamily: theme.fontFamily }}>
      
      {/* Share Button - Top Right Corner */}
      <button
        onClick={handleShare}
        className="fixed top-2 right-2 sm:top-6 sm:right-6 p-2 sm:p-3 rounded-full shadow flex items-center justify-center z-50 transition hover:scale-110"
        style={{
          background: theme.primaryColor,
          color: theme.backgroundColor,
          border: `1px solid ${theme.secondaryColor}`,
        }}
      >
        <Share className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <div className="w-full sm:max-w-md bg-white/90 rounded-3xl shadow-2xl flex flex-col items-center relative mt-12 sm:mt-16" style={{ border: `2px solid ${theme.primaryColor}` }}>
        
        <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 shadow-lg flex items-center justify-center text-4xl sm:text-5xl font-bold overflow-hidden" style={{ background: theme.primaryColor, color: theme.backgroundColor, borderColor: theme.secondaryColor }}>
            {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="pt-20 sm:pt-24 pb-6 px-3 sm:px-6 w-full flex flex-col items-center gap-3 sm:gap-4">
          <h1 className="text-lg sm:text-2xl font-bold text-center" style={{ color: theme.textColor, fontFamily: theme.fontFamily }}>{username}</h1>
          <p className="text-center text-xs sm:text-sm mb-2" style={{ color: theme.textColor, opacity: 0.7 }}>
            Join {username} at <a href="/" className="underline">Linkly</a>
          </p>
          <p className="text-center text-xs sm:text-base mb-2 px-1 sm:px-2" style={{ color: theme.textColor, opacity: 0.85, fontFamily: theme.fontFamily }}>{bio}</p>

          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-3">
            {quickLinks.map(link => {
              const Icon = iconMap[link.iconType] || LinkIcon;
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 rounded-full shadow flex items-center justify-center transition hover:scale-105" style={{ background: theme.secondaryColor, color: theme.backgroundColor }}>
                  <Icon className="w-4 h-4 sm:w-6 sm:w-6" />
                </a>
              );
            })}
          </div>

          <div className="w-full flex flex-col gap-2 sm:gap-3">
            {categories.length === 0 ? (
              <p className="text-center text-xs sm:text-sm" style={{ color: theme.textColor, opacity: 0.7 }}>
                No links available.
              </p>
            ) : (
              categories.map(category => (
                <div key={category} className="mb-1 sm:mb-2">
                  <h2 className="text-xs sm:text-base font-bold mb-1 uppercase tracking-wide" style={{ color: theme.primaryColor, opacity: 0.8 }}>{category}</h2>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    {groupedLinks[category].map(link => {
                      const Icon = iconMap[link.iconType] || LinkIcon;
                      return (
                        <button key={link.id} onClick={() => handleLinkClick(link.id, link.url)} className={`flex items-center gap-1 sm:gap-3 font-bold px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow transition w-full text-left text-xs sm:text-base ${link.id === topLink?.id ? "ring-2 ring-yellow-400 bg-yellow-100" : ""}`} style={{ background: link.id === topLink?.id ? "#fef08a" : theme.primaryColor, color: link.id === topLink?.id ? "#92400e" : theme.backgroundColor, fontFamily: theme.fontFamily }}>
                          <Icon className="w-3 h-3 sm:w-5 sm:h-5" />
                          {link.title}
                          {typeof link.clicks === "number" && <span className="ml-auto text-[10px] sm:text-sm opacity-70">{link.clicks} clicks</span>}
                          {link.id === topLink?.id && <span className="ml-1 px-1 py-0.5 bg-yellow-400 text-yellow-900 rounded text-[10px] sm:text-xs font-semibold">Top</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-2 sm:bottom-6 sm:left-6 z-50 flex flex-col items-center">
        <QRCodeCanvas id="profile-qr" value={window.location.href} size={50} bgColor="#fff" fgColor="#000" level="H" includeMargin={true} style={{ borderRadius: "12px", boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)", background: "#fff" }} />
        <span className="mt-1 text-[9px] sm:text-sm font-semibold" style={{ color: "#111", background: "rgba(255,255,255,0.7)", borderRadius: "6px", padding: "1px 4px" }}>Scan Me</span>
      </div>

    </div>
  );
};

export default PublicProfile;
