import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
import { FaDiscord, FaPinterest,FaReddit,FaSnapchat,FaTelegram,FaTiktok,FaWhatsapp} from "react-icons/fa";
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Github,
  
  Link as LinkIcon,
  Share,
  EllipsisVertical,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

// Map icon type to components
const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  github:Github,
  default: LinkIcon,
  iscord: FaDiscord,
  Pinterest: FaPinterest,
  tiktok: FaTiktok,
  snapchat: FaSnapchat,
  reddit: FaReddit,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
};

const UserProfile = () => {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const links = location.state?.links || [];
  const quickLinks = links.slice(0, 3);
  const bio = location.state?.bio || "Welcome to my links page 🚀";
  const profilePic = location.state?.profilePic || null;
  const theme = location.state?.theme || {
    primaryColor: "#2563eb",   // blue-600 (good for buttons/links)
    secondaryColor: "#10b981", // green-500 (for highlights)
    backgroundColor: "#f3f4f6", // gray-100 (light background for readability)
    textColor: "#111827",       // gray-900 (dark text, high contrast)
    fontFamily: "'Inter', sans-serif"
  };
  
  // Add Google Fonts for the playful/cartoon fonts
  useEffect(() => {
    // Only add if not already present
    if (!document.getElementById('google-fonts-custom-theme')) {
      const link = document.createElement('link');
      link.id = 'google-fonts-custom-theme';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Comic+Neue&family=Bubblegum+Sans&family=Fredoka+One&family=Bangers&family=Architects+Daughter&display=swap';
      document.head.appendChild(link);
    }
    return () => {
      // Clean up when component unmounts
      const link = document.getElementById('google-fonts-custom-theme');
      if (link) document.head.removeChild(link);
    };
  }, []);

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/${username}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${username}'s Links`,
        text: `Check out ${username}'s links on Linkly!`,
        url: publicUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(publicUrl).then(() => {
        alert("Link copied to clipboard! 📋\n\nShare this link with others to show them your profile.");
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = publicUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard! 📋\n\nShare this link with others to show them your profile.");
      });
    }
  };

  // Use local state for links to update clicks
  const [localLinks, setLocalLinks] = useState(links);

  const categories = [...new Set(localLinks.map(link => link.category || "None"))];
  const groupedLinks = categories.reduce((acc, cat) => {
    acc[cat] = localLinks.filter(link => (link.category || "None") === cat);
    return acc;
  }, {});

  // Find the top performing link (by clicks)
  const topLink = localLinks.reduce((max, link) => (link.clicks || 0) > (max?.clicks || 0) ? link : max, localLinks[0]);

  // Click handler
  const handleLinkClick = (id, url) => {
    setLocalLinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link
      )
    );
    // Open the link in a new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // State to control QR code visibility
  // const [showQR, setShowQR] = useState(false);

  return (
    
   <div
  className="min-h-screen flex flex-col items-center justify-start px-2 py-4 sm:px-6 sm:py-12"
  style={{
    background: theme.backgroundColor,
    fontFamily: theme.fontFamily,
    transition: "background 0.3s",
  }}
>
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
  {/* Back Button - closer on mobile */}
  <button
    onClick={() => navigate("/dashboard")}
    className="fixed top-2 left-2 sm:top-6 sm:left-6 px-2 py-1 sm:px-4 sm:py-2 rounded-full font-semibold shadow bg-white text-black hover:bg-gray-100 z-50 text-xs sm:text-base"
    style={{ border: `1.5px solid ${theme.primaryColor}` }}
  >
    ← Back
  </button>

  {/* Card */}
  <div
    className="w-full sm:max-w-md bg-white/90 rounded-3xl shadow-2xl flex flex-col items-center relative mt-12 sm:mt-16"
    style={{
      border: `2px solid ${theme.primaryColor}`,
      boxShadow: `0 8px 32px 0 ${theme.primaryColor}33`,
    }}
  >
    {/* Profile Picture */}
    <div className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2">
      <div
        className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 shadow-lg flex items-center justify-center text-4xl sm:text-5xl font-bold overflow-hidden"
        style={{
          background: theme.primaryColor,
          color: theme.backgroundColor,
          borderColor: theme.secondaryColor,
        }}
      >
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
    </div>

    {/* Card Content */}
    <div className="pt-20 sm:pt-24 pb-6 px-3 sm:px-6 w-full flex flex-col items-center gap-3 sm:gap-4">
      {/* Greeting */}
      <div
        className="text-sm sm:text-lg font-semibold text-center"
        style={{ color: theme.primaryColor, fontFamily: theme.fontFamily }}
      >
        {getGreeting()}
      </div>

      {/* Username */}
      <h1
        className="text-lg sm:text-2xl font-bold text-center"
        style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
      >
        {username}
      </h1>

      {/* Bio */}
      <p
        className="text-center text-xs sm:text-base mb-2 px-1 sm:px-2"
        style={{ color: theme.textColor, opacity: 0.85, fontFamily: theme.fontFamily }}
      >
        {bio}
      </p>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-3">
        {quickLinks.map((link) => {
          const Icon = iconMap[link.iconType] || LinkIcon;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-full shadow flex items-center justify-center transition hover:scale-105"
              style={{ background: theme.secondaryColor, color: theme.backgroundColor }}
            >
              <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
            </a>
          );
        })}
      </div>

      {/* Links Section */}
      <div className="w-full flex flex-col gap-2 sm:gap-3">
        {categories.length === 0 ? (
          <p className="text-center text-xs sm:text-sm" style={{ color: theme.textColor, opacity: 0.7 }}>
            No links available.
          </p>
        ) : (
          categories.map((category) => (
            <div key={category} className="mb-1 sm:mb-2">
              <h2
                className="text-xs sm:text-base font-bold mb-1 uppercase tracking-wide"
                style={{ color: theme.primaryColor, opacity: 0.8 }}
              >
                {category}
              </h2>
              <div className="flex flex-col gap-1 sm:gap-2">
                {groupedLinks[category].map((link) => {
                  const Icon = iconMap[link.iconType] || LinkIcon;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id, link.url)}
                      className={`flex items-center gap-1 sm:gap-3 font-bold px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow transition w-full text-left text-xs sm:text-base ${
                        link.id === topLink?.id
                          ? "ring-2 ring-yellow-400 bg-yellow-100"
                          : ""
                      }`}
                      style={{
                        background: link.id === topLink?.id ? "#fef08a" : theme.primaryColor,
                        color: link.id === topLink?.id ? "#92400e" : theme.backgroundColor,
                        fontFamily: theme.fontFamily,
                        textDecoration: "none",
                      }}
                    >
                      <Icon className="w-3 h-3 sm:w-5 sm:h-5" />
                      {link.title}
                      {typeof link.clicks === "number" && (
                        <span className="ml-auto text-[10px] sm:text-sm opacity-70">
                          {link.clicks} clicks
                        </span>
                      )}
                      {link.id === topLink?.id && (
                        <span className="ml-1 px-1 py-0.5 bg-yellow-400 text-yellow-900 rounded text-[10px] sm:text-xs font-semibold">
                          Top
                        </span>
                      )}
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

  {/* QR Code always visible - bottom left */}
  <div className="fixed bottom-2 left-2 sm:bottom-6 sm:left-6 z-50 flex flex-col items-center">
    <QRCodeCanvas
      id="profile-qr"
      value={window.location.href}
      size={50}
      sm:size={80}
      bgColor="#fff"
      fgColor="#000"
      level="H"
      includeMargin={true}
      style={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
        background: "#fff",
      }}
    />
    <span
      className="mt-1 text-[9px] sm:text-sm font-semibold"
      style={{
        color: getContrastColor(theme.backgroundColor),
        background: "rgba(255,255,255,0.7)",
        borderRadius: "6px",
        padding: "1px 4px",
      }}
    >
      Scan Me
    </span>
  </div>
  </div>

  );
};

function getGreeting() {
  const hour = new Date().getHours();
  const greetings = [
    "Having a great day!",
    "Welcome to my digital space!",
    "Glad to see you here!",
    "Check out my favorite links below!",
    "Thanks for stopping by!"
  ];
  const base =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";
  const random = greetings[Math.floor(Math.random() * greetings.length)];
  return `${base}, ${random}`;
}

function getContrastColor(bgColor) {
  // Remove hash if present
  const color = bgColor.replace("#", "");
  // Convert to RGB
  const r = parseInt(color.substr(0,2),16);
  const g = parseInt(color.substr(2,2),16);
  const b = parseInt(color.substr(4,2),16);
  // Calculate luminance
  const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
  return luminance > 0.6 ? "#222222" : "#ffffff";
}

export default UserProfile;
