import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for back navigation

const ContactUs = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12">
      {/* Back Button at the bottom */}
      <div className="items-left mx-6 ">
          <button
            onClick={handleBack}
            className="bg-yellow-400 text-black py-1 px-3 rounded-lg shadow-xl hover:bg-rose-500 hover:font-bold transition duration-300 transform hover:scale-105"
          >
            Back
          </button>
        </div>
      <div className="container w-4/5 lg:w-3/5 bg-gray-800 p-8 rounded-lg shadow-lg items-center mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400">Contact Us</h1>
        <div className="">
          <div>
            <p className="text-lg leading-relaxed mb-6">
              We'd love to hear from you! Whether you have a question about our services, need assistance, or just want to give feedback, we're here to help.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              You can reach us via email at <span className="font-semibold text-yellow-400">assignmentportal2024@gmail.com</span> .
            </p>
            <p className="text-lg leading-relaxed">
              Our office hours are from Monday to Friday, 9:00 AM to 5:00 PM. We look forward to assisting you!
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ContactUs;
