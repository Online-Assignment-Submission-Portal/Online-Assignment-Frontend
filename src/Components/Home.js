import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaUpload, FaClock, FaChalkboardTeacher, FaStar, FaSearch } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AshutoshPhoto from "../photos/AshutoshPic.png";
import ShashiPhoto from "../photos/ShashiPic.png";
import NilayPhoto from "../photos/NilayPic.jpg";
import ShivanshPhoto from "../photos/ShivanshPic.png";
import SachinPhoto from "../photos/SachinPic.png";
import AnuragPhoto from "../photos/AnuragPic.jpg";

const developers = [
  { name: "Ashutosh Kumar", role: "Full Stack Developer", desc: "Expert in React and UI/UX design.", photo: AshutoshPhoto },
  { name: "Shashi Shankar", role: "Full Stack Developer", desc: "Specializes in Node.js and database management.", photo: ShashiPhoto },
  { name: "Shivansh Mishra", role: "Full Stack Developer", desc: "Handles both frontend and backend tasks.", photo: ShivanshPhoto },
  { name: "Nilay Chaudhary", role: "Full Stack Developer", desc: "Ensures the project is on track and meets deadlines.", photo: NilayPhoto },
  { name: "Sachin Kumar", role: "ML Engineer", desc: "Responsible for testing and quality assurance.", photo: SachinPhoto },
  { name: "Anurag Saran", role: "ML Engineer", desc: "Manages deployment and cloud infrastructure.", photo: AnuragPhoto }
];

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
      <Header />

      <section className="relative flex flex-col items-center justify-center pt-28 pb-20 text-white text-center px-6 bg-opacity-70">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg animate-fade-in">
            CollegeHub - Submit Assignments Effortlessly!
          </h1>
          <p className="text-lg text-gray-200 mt-6 mb-8 leading-relaxed animate-fade-in">
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

      <section className="bg-gradient-to-r from-purple-600 to-blue-500 py-10 px-6 text-white text-center">
        <h2 className="text-4xl font-bold text-white mb-12">Why Choose CollegeHub?</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            { icon: <FaUpload className="text-blue-400 text-5xl mb-4 animate-bounce" />, title: "Easy Uploads", desc: "Submit assignments quickly with our intuitive interface." },
            { icon: <FaClock className="text-yellow-400 text-5xl mb-4 animate-bounce" />, title: "Deadline Tracking", desc: "Stay on top of assignments with automated deadline reminders." },
            { icon: <FaChalkboardTeacher className="text-green-400 text-5xl mb-4 animate-bounce" />, title: "Teacher Feedback", desc: "Receive feedback and improve your work with real-time grading." },
            { icon: <FaSearch className="text-green-400 text-5xl mb-4 animate-bounce" />, title: "Plagiarism Check", desc: "Check for plagiarism between different files submitted in the assignment." }
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl duration-500">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-10 px-6 text-gray-200 text-center">
        <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {[
            { text: "CollegeHub made submitting assignments so easy. I never miss a deadline anymore!" },
            { text: "I can easily review assignments and provide feedback instantly. This is a game-changer for educators!" }
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl duration-500">
              <FaStar className="text-yellow-500 text-4xl mb-4 animate-spin" />
              <p className="text-lg italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-600 to-blue-500 py-10 px-6 text-white text-center">
        <h2 className="text-4xl font-bold text-white mb-12">Meet the Developers</h2>
        <div className="max-w-5xl mx-auto">
          <Slider {...settings}>
            {developers.map((developer, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl duration-500 mx-2">
                <img src={developer.photo} alt={developer.name} className="w-24 h-24 rounded-full mb-4" />
                <h3 className="text-xl font-semibold mb-2">{developer.name}</h3>
                <h4 className="text-lg font-medium mb-2">{developer.role}</h4>
                <p className="text-gray-300">{developer.desc}</p>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
