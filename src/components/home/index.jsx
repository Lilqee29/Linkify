import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    alert("You are in Home!");
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <h1 className="text-2xl font-bold">Home Page (Test Alert)</h1>
    </div>
  );
};

export default Home;
