import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header"; 

const Home = () => {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page!</h1>
        <p className="text-lg mb-8 text-center">
          This site allows you to submit your assignments online with ease. Sign up or sign in to get started!
        </p>
      </main>
    </div>
  );
};

export default Home;
