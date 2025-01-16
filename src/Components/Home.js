import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const Home = () => {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12" 
      style={{
        backgroundImage: "url('https://www.bitmesra.ac.in/UploadedDocuments/user_pratyush_869/Header/Header295e75781b0f4b19b292cba095f2d310_Institute_Building.png')",
        backgroundSize: "cover",
        backgroundPosition: "top"
      }}>
        <h1 className="text-4xl text-blue-600 font-bold mb-4">Welcome to the Home Page!</h1>
        <p className="text-lg text-neutral-900 mb-8 text-center">
          This site allows you to submit your assignments online with ease. Sign up or sign in to get started!
        </p>
      </main>
    </div>
  );
};

export default Home;
