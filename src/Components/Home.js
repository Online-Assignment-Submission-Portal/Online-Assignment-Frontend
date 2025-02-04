import React from "react";
import Header from "./Header";
import Footer from './Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <main
      className="min-h-screen flex flex-col items-center  relative text-white py-12"
      style={{
        backgroundImage: "url('https://www.bitmesra.ac.in/UploadedDocuments/user_pratyush_869/Header/Header295e75781b0f4b19b292cba095f2d310_Institute_Building.png')",
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl font-bold text-blue-400  mb-6">
          Welcome to CollegeHub!
        </h1>
        <p className="text-xl text-gray-200 mt-28 mb-8">
          This site allows you to submit your assignments online with ease. <br />
          Sign up or sign in to get started!
        </p>
        <p className="text-xl text-gray-100 mb-8">
          Our portal offers a centralized platform for students to submit assignments and for teachers to review, grade, and provide feedback. 
          With features like assignment submission, deadlines, dashboards, grading and feedback system, and more, managing assignments has never been easier.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/signup"
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Sign Up
          </a>
          <a
            href="/signin"
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
    <Footer />
    </div>
  );
};

export default Home;