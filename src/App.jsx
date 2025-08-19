import React, { useState, useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";

// Landing Page Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./components/auth/login";
import Register from "./components/auth/register";

// Dashboard
import Dashboard from "./components/Dashboard";

// Context
import { AuthProvider, useAuth } from "./contexts/authContext";

// ===== Landing Page Layout =====
const Landing = () => (
  <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
    <Navbar />
    <div className="max-w-7xl mx-auto pt-20 px-6">
      <HeroSection />
      <FeatureSection />
      <Workflow />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  </div>
);

// ===== Private Route Wrapper =====


// ===== App Component =====
function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode toggle effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ===== Routes Configuration =====
  const routesArray = [
    { path: "/", element: <Landing /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "*", element: <Landing /> }, // fallback
  ];

  const routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      {/* Dark mode toggle button */}


      {/* Render Routes */}
      <div className="w-full min-h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
