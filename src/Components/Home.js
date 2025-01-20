import React from "react";
import Header from "./Header";
import Footer from './Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <main
        className="min-h-screen flex flex-col items-center justify-center relative text-white py-12"
        style={{
          backgroundImage: "url('https://www.bitmesra.ac.in/UploadedDocuments/user_pratyush_869/Header/Header295e75781b0f4b19b292cba095f2d310_Institute_Building.png')",
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl font-bold text-blue-400 mb-6">
            Welcome to the Home Page!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            This site allows you to submit your assignments online with ease. <br />
            Sign up or sign in to get started!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
