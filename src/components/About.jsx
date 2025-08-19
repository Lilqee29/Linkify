import React from "react";
import aboutImage from "../assets/about.jpg"; // We'll add an image next

const About = () => {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={aboutImage}
            alt="Restaurant"
            className="rounded-lg shadow-lg animate-fadeIn"
          />
        </div>

        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-4 animate-fadeIn">About Our Restaurant</h2>
          <p className="text-gray-700 text-lg mb-6 animate-fadeIn delay-200">
            We provide a unique dining experience with fresh ingredients, friendly staff, and a cozy atmosphere. Enjoy delicious meals made with love.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 animate-fadeIn delay-400">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
 