import React from 'react';
import logo from "../assets/about.jpg";

export const Navbar = () => {
  return (
    <>
      {/* Navbar container */}
      <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-neutral-700/80"></nav>

      {/* Inner content container */}
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-center items-center">
          <div className="flex items-center flex-shrink-0">
            {/* Correctly render logo without quotes around variable */}
            <img src={logo} alt="Logo" />
          </div>
        </div>
      </div>
    </>
  );
};
