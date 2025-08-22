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
    classic: { primaryColor: "#a78bfa", secondaryColor: "#f472b6", backgroundColor: "#0f0f0f", textColor: getContrastColor("#0f0f0f"), fontFamily: "'Inter', sans-serif" },
    ocean: { primaryColor: "#38bdf8", secondaryColor: "#0ea5e9", backgroundColor: "#082f49", textColor: getContrastColor("#082f49"), fontFamily: "'Inter', sans-serif" },
    forest: { primaryColor: "#34d399", secondaryColor: "#059669", backgroundColor: "#064e3b", textColor: getContrastColor("#064e3b"), fontFamily: "'Inter', sans-serif" },
    sunset: { primaryColor: "#f59e0b", secondaryColor: "#ef4444", backgroundColor: "#7c2d12", textColor: "#111827", fontFamily: "'Inter', sans-serif" },
    cartoon: { primaryColor: "#ec4899", secondaryColor: "#8b5cf6", backgroundColor: "#fdf4ff", textColor: getContrastColor("#fdf4ff"), fontFamily: "'Comic Neue', cursive" },
    playful: { primaryColor: "#f43f5e", secondaryColor: "#3b82f6", backgroundColor: "#fdf2f8", textColor: getContrastColor("#fdf2f8"), fontFamily: "'Bubblegum Sans', cursive" },
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
