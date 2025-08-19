import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <button
        className="fixed top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
        onClick={() => setDarkMode(!darkMode)}
      >
        Toggle Dark Mode
      </button>

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
};

export default App;
