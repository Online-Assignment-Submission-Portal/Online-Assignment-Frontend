import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaUpload, FaClock, FaChalkboardTeacher, FaStar } from "react-icons/fa";

const Home = () => {
  return (
    <div className="relative">
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-fixed -z-10"
        style={{
          backgroundImage:
            "url('https://www.bitmesra.ac.in/UploadedDocuments/user_pratyush_869/Header/Header295e75781b0f4b19b292cba095f2d310_Institute_Building.png')",
        }}
      ></div>

      <Header />

      <section className="relative flex flex-col items-center justify-center pt-28 pb-20 text-white text-center px-6 bg-black bg-opacity-70">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold text-blue-400 drop-shadow-lg">
            CollegeHub - Submit Assignments Effortlessly!
          </h1>
          <p className="text-lg text-gray-200 mt-6 mb-8 leading-relaxed">
            A seamless way to submit, track, and manage assignments. Stay organized, get feedback, and never miss a deadline!
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/signup"
              className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/signin"
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-black bg-opacity-70 py-10 px-6 text-white text-center">
        <h2 className="text-4xl font-bold mb-12">Why Choose CollegeHub?</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            { icon: <FaUpload className="text-blue-400 text-5xl mb-4" />, title: "Easy Uploads", desc: "Submit assignments quickly with our intuitive interface." },
            { icon: <FaClock className="text-yellow-400 text-5xl mb-4" />, title: "Deadline Tracking", desc: "Stay on top of assignments with automated deadline reminders." },
            { icon: <FaChalkboardTeacher className="text-green-400 text-5xl mb-4" />, title: "Teacher Feedback", desc: "Receive feedback and improve your work with real-time grading." }
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg transition transform hover:scale-105">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black bg-opacity-70 py-10 px-6 text-gray-200 text-center">
        <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            { text: "CollegeHub made submitting assignments so easy. I never miss a deadline anymore!" },
            { text: "I can easily review assignments and provide feedback instantly. This is a game-changer for educators!" }
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
              <FaStar className="text-yellow-500 text-4xl mb-4" />
              <p className="text-lg italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
