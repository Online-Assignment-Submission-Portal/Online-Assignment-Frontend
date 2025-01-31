import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for back navigation

const AboutUs = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="bg-gray-900  flex flex-col text-white min-h-screen py-12">
      <div className="flex flex-row justify-end mx-8 mt-2 mb-4">
        <button
          onClick={handleBack}
          className="bg-yellow-400 text-black py-2 px-4 rounded-lg shadow-xl hover:bg-rose-500 font-semibold transition duration-200 transform hover:scale-[102%]"
        >
          Back
        </button>
      </div>
      <div className="container w-4/5 lg:w-3/5 mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      
      
        <h1 className="text-4xl font-bold text-center mb-6  text-yellow-400">About Us</h1>
        <div className="">
          
            <p className="text-lg leading-relaxed mb-6">
              Welcome to <span className="font-semibold text-yellow-400">Online Assignment Submission Portal</span>! a platform crafted with care by a passionate team of six innovative minds.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              We believe in revolutionizing the way assignments are managed, submitted, and evaluated. Our portal is designed to simplify academic workflows for both students and teachers by providing a centralized, secure, and user-friendly solution.
            </p>
            <p className="text-3xl font-bold mb-3">Our Mission</p>
            <p className="text-lg leading-relaxed mb-6">
            To empower educators and learners with a seamless, efficient, and transparent assignment management system, enhancing productivity and academic excellence.
            </p>
            <p className="text-3xl font-bold mb-3">Who We Are</p>
            <p className="text-lg leading-relaxed mb-6">
            We are a diverse team of tech enthusiasts, combining our expertise in software development, user experience design, and cutting-edge technology to create a tool that meets the evolving needs of modern education.            </p>
            <p className="text-3xl font-bold mb-3">What We Do</p>
            <p className="text-lg leading-relaxed mb-3">
            From intuitive assignment submissions to real-time feedback and advanced analytics, our platform ensures every detail is taken care of. By integrating features like plagiarism detection, gamification, and role-based access control, we aim to set a new standard for academic tools.            </p>
            <p className="text-lg leading-relaxed">Join us on our journey to make education smarter, simpler, and more effective.

</p>
          
          
        </div>


      
      </div>
    </div>
  );
};

export default AboutUs;
