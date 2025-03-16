import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaUpload, FaClock, FaChalkboardTeacher, FaStar, FaSearch, FaFacebookMessenger, FaUserLock } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AshutoshPhoto from "../photos/AshutoshPic.png";
import ShashiPhoto from "../photos/ShashiPic.png";
import NilayPhoto from "../photos/NilayPic.jpg";
import ShivanshPhoto from "../photos/ShivanshPic.jpg";
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
    <div className="relative min-h-screen">
      <Header />

      <section className="relative bg-gradient-to-br from-blue-500 to-purple-600  flex flex-col items-center justify-center pt-28 pb-20 text-white text-center px-6 bg-opacity-70">
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

      <section className="relative bg-gradient-to-bl from-purple-600 to-blue-500 py-10 px-6 text-white text-center">
        <h2 className="text-4xl font-bold text-white mb-12">Why Choose CollegeHub?</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto relative z-10">
          {[
            { icon: <FaUpload className="text-blue-400 text-5xl mb-4 animate-bounce" />, title: "Easy Uploads", desc: "Submit assignments quickly with our intuitive interface." },
            { icon: <FaClock className="text-yellow-400 text-5xl mb-4 animate-bounce" />, title: "Deadline Tracking", desc: "Stay on top of assignments with automated deadline reminders." },
            { icon: <FaChalkboardTeacher className="text-green-400 text-5xl mb-4 animate-bounce" />, title: "Teacher Feedback", desc: "Receive feedback and improve your work with real-time grading." },
            { icon: <FaSearch className="text-green-400 text-5xl mb-4 animate-bounce" />, title: "Plagiarism Check", desc: "Check for plagiarism between different files submitted in the assignment." },
            { icon: <FaFacebookMessenger className="text-green-400 text-5xl mb-4 animate-bounce" />, title: "Realtime Chat", desc: "Real-time chat between students and teachers." },
            { icon: <FaUserLock className="text-green-400 text-5xl mb-4 animate-bounce" />, title: "Secure Environment", desc: "Easy and secure access to data." }
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl duration-500">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full z-0">
          <svg className="w-full fill-white" viewBox="0 0 1440 320">
            <path fill="#A0AEC0" fillOpacity="1" d="M0,224L60,208C120,192,240,160,360,181.3C480,203,600,277,720,272C840,267,960,181,1080,160C1200,139,1320,181,1380,202.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <section className="relative bg-gradient-to-tr to-blue-500 from-purple-600 pt-20 px-6 text-gray-200 text-center">
        <div className="absolute top-0 left-0 w-full z-0">
          <svg className="w-full fill-white" viewBox="0 0 1440 320">
            <path fill="#A0AEC0" fillOpacity="1" d="M0,128L60,144C120,160,240,192,360,208C480,224,600,224,720,192C840,160,960,96,1080,101.3C1200,107,1320,181,1380,218.7L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-white">What Our Users Say</h2>
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
        </div>
      </section>
      <section className="bg-gradient-to-br from-purple-600 to-blue-500 py-10 px-6 text-white text-center">
        <h2 className="text-4xl font-bold text-white mb-12">Meet the Developers</h2>
        <div className="max-w-4xl mx-auto">
          <Slider {...settings}>
            {developers.map((developer, index) => (
              <div key={index} className="px-2">
                <div className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl text-center min-h-[100px]">
                  <img
                    src={developer.photo}
                    alt={developer.name}
                    className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-gray-600"
                  />
                  <h3 className="text-lg font-semibold text-white">{developer.name}</h3>
                  <h4 className="text-sm font-medium text-gray-400">{developer.role}</h4>
                  <p className="text-gray-300 text-sm mt-2">{developer.desc}</p>
                </div>
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
