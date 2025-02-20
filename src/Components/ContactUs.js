import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', feedback: '' });
  const [loading, setLoading] = useState(false);
  const apiUrl = window.location.hostname === 'localhost'
  ? "http://localhost:8000" : process.env.REACT_APP_BASE_URL;
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/user/contactus`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.status === 200) {
        toast.success('Feedback submitted successfully!');
        setFormData({ name: '', email: '', feedback: '' });
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      toast.error('Error submitting feedback.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-4">
      <div className="flex flex-row mx-8 mt-2 mb-4">
        <button
          onClick={handleBack}
          className="bg-yellow-400 text-black py-2 px-4 rounded-lg shadow-xl hover:bg-rose-500 font-semibold transition duration-200 transform hover:scale-[102%]"
        >
          Back
        </button>
      </div>
      <div className="container w-4/5 lg:w-3/5 bg-gray-800 p-8 rounded-lg shadow-lg items-center mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400">Contact Us</h1>
        <p className="text-lg leading-relaxed mb-6">
          We'd love to hear from you! Whether you have a question, need assistance, or just want to give feedback, we're here to help.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="Your Feedback"
            rows="4"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded-lg shadow-xl hover:bg-rose-500 font-semibold transition duration-200 transform hover:scale-[102%]"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <p className="leading-relaxed mt-6 sm:text-lg">
          You can also reach out to us at assignmentportal2024@gmail.com!
        </p>
      </div>
    </div>
  );
};

export default ContactUs;