import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for back navigation

const ContactUs = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg leading-relaxed mb-6">
              We'd love to hear from you! Whether you have a question about our services, need assistance, or just want to give feedback, we're here to help.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              You can reach us via email at <span className="font-semibold text-yellow-400">support@companyname.com</span> or call us at <span className="font-semibold text-yellow-400">(123) 456-7890</span>.
            </p>
            <p className="text-lg leading-relaxed">
              Our office hours are from Monday to Friday, 9:00 AM to 5:00 PM. We look forward to assisting you!
            </p>
          </div>
          <div>
            <img 
              src="https://via.placeholder.com/500" 
              alt="Contact" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Back Button at the bottom */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleBack}
            className="bg-yellow-400 text-black py-3 px-6 rounded-lg shadow-xl hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
