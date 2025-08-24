import React, { useState, useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";

// Landing Page Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
// import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

// Auth Pages
import Login from "./components/auth/login";
import Register from "./components/auth/register";

// Dashboard
import Dashboard from "./components/dashboard/Dashboard";
import DashboardNavbar from "./components/dashboard/DashboardNavbar"; // ✅ new import
import UserProfile from "./public/UserProfile";
import PublicProfile from "./public/PublicProfile";

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
      {/* <Pricing /> */}
      <Testimonials />
      <Footer />
    </div>
  </div>
);

// ===== Private Route Wrapper =====
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// ===== App Component =====
function App() {
  const [darkMode] = useState(false);

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
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Dashboard />  {/* Navbar is already inside Dashboard */}
        </PrivateRoute>
      ),
    },
    { path: "/profile/:username", element: <UserProfile /> },
    { path: "/:username", element: <PublicProfile /> }, // Public shared link route
    { path: "*", element: <Landing /> }, // fallback
  ];

  const routesElement = useRoutes(routesArray);

  return <AuthProvider>{routesElement}</AuthProvider>;
}

export default App;
