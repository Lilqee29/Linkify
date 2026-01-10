// src/public/PublicProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaDiscord, FaPinterest, FaReddit, FaSnapchat, FaTelegram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { Instagram, Youtube, Twitter, Facebook, Github, Link as LinkIcon, Share, CheckCircle, AlertCircle, MessageSquare, Send, ArrowLeft } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { sendMessageToUser } from "../firebase/DashboardMessages";
import { trackLinkClick } from "../firebase/trackClick";
import { db } from "../firebase/firebase";
import { useAlert } from "../contexts/AlertContext";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showAlert } = useAlert();
  const [localLinks, setLocalLinks] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Got it!",
    cancelText: "",
    type: "info"
  });

  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !profileData?.id) return;

    setSendingMessage(true);
    const success = await sendMessageToUser(profileData.id, messageText);
    
    if (success) {
      setMessageText("");
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000);
    } else {
      showAlert("Failed to send message. Please try again.", "error");
    }
    setSendingMessage(false);
  };

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
            id: userId, // CRITICAL: User ID for sending messages
            username: username,
            links: userLinks || [],
            bio: userData.bio || "Welcome to my links page 🚀",
            amaEnabled: userData.amaEnabled !== undefined ? userData.amaEnabled : true,
            profilePic: userData.photoURL || null,
            theme: userData.customTheme || {
              primaryColor: "#6366f1", // Indigo
              secondaryColor: "#818cf8",
              backgroundColor: "#000000",
              textColor: "#ffffff",
              fontFamily: "'Inter', sans-serif"
            }
          };
          
          setProfileData(profileData);
          setLocalLinks(userLinks || []);
        } else {
          setError("Username not found");
        }
      } catch (err) {
        console.error("🚨 Error fetching profile data:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]);

  // Fonts are now handled globally in index.css

  const getModalIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-white" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-white" />;
      default:
        return <CheckCircle className="w-6 h-6 text-white" />;
    }
  };

  const getModalColors = (type) => {
    switch (type) {
      case 'success':
        return { bg: 'bg-green-500', button: 'bg-green-500 hover:bg-green-600' };
      case 'error':
        return { bg: 'bg-red-500', button: 'bg-red-500 hover:bg-red-600' };
      default:
        return { bg: 'bg-blue-500', button: 'bg-blue-500 hover:bg-blue-600' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-orange-500">
            <LinkIcon className="w-6 h-6 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-gray-400 font-medium tracking-wide animate-pulse">Fetching Linkify Profile...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-[100dvh] bg-[#0a0a0c] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">404: Not Found</h1>
        <p className="text-neutral-400 text-lg max-w-sm mb-10 leading-relaxed">
          The Linkify profile <span className="text-white font-mono">@{username}</span> doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <a
            href="/"
            className="flex-1 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/20 active:scale-95"
          >
            Go Home
          </a>
          <a
            href="/register"
            className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all active:scale-95"
          >
            Create Mine
          </a>
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

  const handleLinkClick = async (id, url) => {
    // Update local state immediately for instant UI feedback
    setLocalLinks(prev =>
      prev.map(link => link.id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link)
    );
    
    // Track in Firestore (async, doesn't block navigation)
    if (profileData?.id) {
      trackLinkClick(profileData.id, id);
    }
    
    // Open the link
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
        setConfirmModal({
          isOpen: true,
          title: "Link Copied! 📋",
          message: "Your profile link has been copied to clipboard successfully!",
          onConfirm: () => setConfirmModal({ ...confirmModal, isOpen: false }),
          confirmText: "Got it!",
          cancelText: "",
          type: "success"
        });
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setConfirmModal({
          isOpen: true,
          title: "Link Copied! 📋",
          message: "Your profile link has been copied to clipboard successfully!",
          onConfirm: () => setConfirmModal({ ...confirmModal, isOpen: false }),
          confirmText: "Got it!",
          cancelText: "",
          type: "success"
        });
      });
    }
  };

  const colors = getModalColors(confirmModal.type);

  return (
    <>
      <Helmet>
        <title>{username ? `${username} | Linkify` : "Linkify"}</title>
        <meta name="description" content={bio || `Check out ${username}'s links!`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${username} | Linkify`} />
        <meta property="og:description" content={bio || `Check out ${username}'s links!`} />
        {profilePic && <meta property="og:image" content={profilePic} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${username} | Linkify`} />
        <meta name="twitter:description" content={bio || `Check out ${username}'s links!`} />
        {profilePic && <meta name="twitter:image" content={profilePic} />}
      </Helmet>

      <div className="min-h-screen lg:min-h-[100dvh] flex flex-col items-center pt-16 px-4 pb-20 transition-colors duration-500 overflow-x-hidden" style={{ background: theme.backgroundColor, fontFamily: theme.fontFamily, color: theme.textColor }}>
        
        {/* Spotlight Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spotlight-pulse {
            0% { box-shadow: 0 0 0 0 rgba(${theme.primaryColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(',')}, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(${theme.primaryColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(',')}, 0); }
            100% { box-shadow: 0 0 0 0 rgba(${theme.primaryColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(',')}, 0); }
          }
          .spotlight-link {
            animation: spotlight-pulse 2s infinite;
          }
        `}} />
        
        {/* Back Button (Only show if history exists or state is present) */}
        {(location.state || window.history.length > 1) && (
          <button
            onClick={() => navigate(-1)}
            className="fixed top-6 left-6 p-3 rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95 group backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: `1px solid ${theme.textColor}20`,
              color: theme.textColor
            }}
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        {/* Share Button (Keep this, as it's useful on the live page) */}
        <button
          onClick={handleShare}
          className="fixed top-6 right-6 p-3 rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95 group backdrop-blur-sm"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: `1px solid ${theme.textColor}20`,
            color: theme.textColor
          }}
        >
          <Share className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>

         {/* Main Content (Matching Dashboard Preview Structure) */}
         <div className="w-full max-w-md mx-auto flex flex-col items-center">
            
            {/* Profile Pic */}
            <div className="relative mb-6 z-10">
              <div className="w-28 h-28 rounded-full border-4 shadow-xl flex items-center justify-center text-5xl font-bold overflow-hidden bg-neutral-100"
                  style={{
                    borderColor: theme.primaryColor,
                    color: theme.primaryColor
                  }}
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div>{username.charAt(0).toUpperCase()}</div>
                )}
              </div>
            </div>

            {/* Username & Bio */}
            <div className="text-center w-full z-10 mb-8 space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">@{username}</h1>
              <p className="text-base opacity-80 leading-relaxed max-w-sm mx-auto px-4">
                {bio}
              </p>
            </div>

             {/* AMA / Message Box */}
             {profileData?.amaEnabled !== false && (
              <div className="w-full max-w-sm mb-8">
                 <form onSubmit={handleSendMessage} className="relative">
                   <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-50">
                     <MessageSquare className="w-4 h-4" style={{ color: theme.textColor }} />
                   </div>
                   <input
                     type="text"
                     value={messageText}
                     onChange={(e) => setMessageText(e.target.value)}
                     placeholder={messageSent ? "Message sent! Send another?" : "Ask me anything..."}
                     className="w-full pl-10 pr-12 py-3 rounded-2xl border-none outline-none shadow-lg focus:shadow-xl transition-shadow bg-white/10 backdrop-blur-md placeholder:text-current/50"
                     style={{ 
                       color: theme.textColor,
                       background: theme.backgroundColor === '#ffffff' ? '#f3f4f6' : 'rgba(255,255,255,0.1)'
                     }}
                   />
                   <button
                     type="submit"
                     disabled={!messageText.trim() || sendingMessage}
                     className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 hover:bg-white/10"
                     style={{ color: theme.primaryColor }}
                   >
                     {sendingMessage ? <span className="animate-spin block w-4 h-4 border-2 border-current border-t-transparent rounded-full"/> : <Send className="w-4 h-4" />}
                   </button>
                 </form>
              </div>
             )}

            {/* Links List */}
            <div className="w-full flex flex-col gap-4 z-10">
              {categories.length === 0 ? (
                  <div className="text-center opacity-50 py-10">No public links yet.</div>
              ) : (
                // Flattening links for the simple preview style, or respecting categories if preferred.
                // Dashboard preview showed a FLAT list in the code I viewed (lines 572+).
                // But PublicProfile used categories. 
                // To match PREVIEW exactly, we should just show the list or simplistic category headers.
                // Let's stick to the Dashboard Preview's flat-ish look but maybe keep categories if they add value, 
                // OR simpler: just render all links if the user wants "EXACT" match.
                // However, the dashboard preview loop was `links.map`, implying flat list.
                // I will render a flat list of links to match the preview exactly.
                
                localLinks.filter(link => {
                   if (link.isActive === false) return false;
                   const now = new Date();
                   if (link.scheduledStart && new Date(link.scheduledStart) > now) return false;
                   if (link.scheduledEnd && new Date(link.scheduledEnd) < now) return false;
                   return true;
                }).map((link) => {
                   const isNew = link.createdAt && (new Date() - (link.createdAt.toDate ? link.createdAt.toDate() : new Date(link.createdAt))) < 48 * 60 * 60 * 1000;
                   const isTrending = topLink && link.clicks >= topLink.clicks && topLink.clicks > 0;
                   
                   return (
                     <div
                      key={link.id}
                      onClick={() => handleLinkClick(link.id, link.url)}
                      className={`relative flex items-center justify-between px-5 py-4 rounded-xl shadow-sm transition-all w-full text-left font-medium cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${link.isFeatured ? 'spotlight-link scale-[1.02] z-10' : ''}`}
                      style={{
                        backgroundColor: theme.primaryColor,
                        color: theme.backgroundColor === "#ffffff" ? "#000000" : "#ffffff",
                        opacity: 0.95,
                        border: link.isFeatured ? `2px solid ${theme.secondaryColor}` : 'none'
                      }}
                    >
                      <span className="flex items-center gap-4 min-w-0">
                        {link.iconType === "custom" ? (
                          <img src={link.iconUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                        ) : (
                          (() => {
                            const Icon = iconMap[link.iconType] || LinkIcon;
                            return <Icon className="w-5 h-5 shrink-0" />;
                          })()
                        )}
                        <span className="truncate">{link.title}</span>
                        {isNew && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">New</span>}
                      </span>
                      {isTrending && <span className="flex items-center gap-1 text-[10px] font-bold uppercase py-1 px-2 bg-black/20 rounded-lg">🔥 HOT</span>}
                    </div>
                   );
                 })
              )}
            </div>

            {/* Footer */}
            <div className="mt-16 flex flex-col items-center gap-2 opacity-50 transition-opacity hover:opacity-100">
               <QRCodeCanvas id="profile-qr" value={window.location.href} size={64} bgColor="transparent" fgColor={theme.textColor} level="H" />
               <p className="text-[10px] font-bold tracking-[0.2em] mt-2 uppercase">
                  Powered by Linkify
               </p>
            </div>

         </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-4 sm:p-6 rounded-xl w-11/12 max-w-md relative">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                {getModalIcon(confirmModal.type)}
              </div>
              <h2 className="text-2xl font-bold">{confirmModal.title}</h2>
            </div>
            
            <p className="text-neutral-300 mb-6 whitespace-pre-line">{confirmModal.message}</p>
            
            <div className="flex gap-3">
              {confirmModal.cancelText && (
                <button
                  onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                  className="flex-1 py-3 px-4 rounded-xl bg-neutral-700 text-white font-semibold hover:bg-neutral-600 transition"
                >
                  {confirmModal.cancelText}
                </button>
              )}
              <button
                onClick={confirmModal.onConfirm}
                className={`flex-1 py-3 px-4 rounded-xl text-white font-semibold transition ${colors.button}`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicProfile;
