import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

// Compute text contrast for readability
function getContrastColor(bgColor) {
  if (!bgColor) return "#111111";
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
}

export const useDashboardTheme = () => {
  const [currentTheme, setCurrentTheme] = useState("classic");
  const [customTheme, setCustomTheme] = useState({
    primaryColor: "#a78bfa",
    secondaryColor: "#f472b6",
    backgroundColor: "#0f0f0f",
    textColor: getContrastColor("#0f0f0f"),
    fontFamily: "'Inter', sans-serif",
  });

  const predefinedThemes = {
    midnight: {
      primaryColor: "#6366f1", // Indigo 500
      secondaryColor: "#818cf8", // Indigo 400
      backgroundColor: "#000000", // Pure Black
      textColor: "#ffffff",
      fontFamily: "'Inter', sans-serif"
    },
    luxury: {
      primaryColor: "#d4af37", // Gold
      secondaryColor: "#c5a028", // Darker Gold
      backgroundColor: "#1c1c1c", // Rich Dark Grey
      textColor: "#f3f3f3",
      fontFamily: "'Playfair Display', serif"
    },
    cyberpunk: {
      primaryColor: "#00ff9d", // Neon Green
      secondaryColor: "#ff0055", // Neon Pink
      backgroundColor: "#0b0b19", // Deep Space Blue
      textColor: "#e0e0e0",
      fontFamily: "'Orbitron', sans-serif"
    },
    minimalist: {
      primaryColor: "#171717", // Neutral 900
      secondaryColor: "#525252", // Neutral 600
      backgroundColor: "#ffffff", // Pure White
      textColor: "#171717",
      fontFamily: "'DM Sans', sans-serif"
    },
    lush: {
      primaryColor: "#10b981", // Emerald 500
      secondaryColor: "#34d399", // Emerald 400
      backgroundColor: "#064e3b", // Emerald 900
      textColor: "#ecfdf5",
      fontFamily: "'Montserrat', sans-serif"
    },
    sunsetPro: {
      primaryColor: "#f97316", // Orange 500
      secondaryColor: "#db2777", // Pink 600
      backgroundColor: "#4c0519", // Rose 950
      textColor: "#fff1f2",
      fontFamily: "'Poppins', sans-serif"
    },
    dream: {
      primaryColor: "#8b5cf6", // Violet
      secondaryColor: "#c4b5fd", // Soft Violet
      backgroundColor: "#f5f3ff", // Very Light Violet
      textColor: "#4c1d95", // Deep Violet
      fontFamily: "'Quicksand', sans-serif"
    },
    slate: {
      primaryColor: "#f8fafc", // Slate 50
      secondaryColor: "#94a3b8", // Slate 400
      backgroundColor: "#0f172a", // Slate 900
      textColor: "#f1f5f9",
      fontFamily: "'Work Sans', sans-serif"
    }
  };

  // Load user's saved theme from Firestore on mount
  useEffect(() => {
    const loadTheme = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.theme && predefinedThemes[data.theme]) {
          setCurrentTheme(data.theme);
          setCustomTheme(predefinedThemes[data.theme]);
        } else if (data.theme === "custom" && data.customTheme) {
          setCurrentTheme("custom");
          setCustomTheme(data.customTheme);
        }
      } else {
        setCurrentTheme("classic");
        setCustomTheme(predefinedThemes["classic"]);
      }
    };
    loadTheme();
  }, [auth.currentUser]);

  // Load theme from localStorage as fallback
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

  // Save theme to Firebase + localStorage
  const handleSaveTheme = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);

      await setDoc(userRef, currentTheme === "custom" ? { theme: "custom", customTheme } : { theme: currentTheme }, { merge: true });

      localStorage.setItem("theme", currentTheme);
      if (currentTheme === "custom") {
        localStorage.setItem("customTheme", JSON.stringify(customTheme));
      } else {
        localStorage.removeItem("customTheme");
      }

      console.log("Theme saved successfully!");
    } catch (err) {
      console.error("Error saving theme:", err);
    }
  };

  // Updated setters for custom theme changes
  const updateCustomTheme = (updates) => {
    setCustomTheme((prev) => ({ ...prev, ...updates }));
    setCurrentTheme("custom"); // mark as custom whenever a change occurs
  };

  return {
    currentTheme,
    setCurrentTheme,
    customTheme,
    setCustomTheme: updateCustomTheme, // use this to auto-switch to custom
    predefinedThemes,
    handleSaveTheme,
  };
};
