import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const Services = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10">
      <div className="flex flex-row justify-end mx-8 mt-2 mb-4">
        <button
          onClick={handleBack}
          className="bg-yellow-400 text-black py-2 px-4 rounded-lg shadow-xl hover:bg-rose-500 font-semibold transition duration-200 transform hover:scale-[102%]"
        >
          Back
        </button>
      </div>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">Our Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Assignment Submission */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-primary mb-4">Assignment Submission</h2>
            <p className="text-lg text-gray-300">
              Students can easily upload and submit their assignments through our secure portal. Stay organized and on top of deadlines.
            </p>
          </div>

          {/* Plagiarism Detection */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-primary mb-4">Plagiarism Detection</h2>
            <p className="text-lg text-gray-300">
              Our platform checks assignments for plagiarism using advanced algorithms, ensuring academic integrity for all submissions.
            </p>
          </div>

          {/* Chat with Teachers */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-primary mb-4">Chat with Teachers</h2>
            <p className="text-lg text-gray-300">
              Students can interact with their teachers directly through our messaging system for guidance, feedback, and discussions.
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Services;
