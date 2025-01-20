import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400">About Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg leading-relaxed mb-6">
              Welcome to <span className="font-semibold text-yellow-400">[Company Name]</span>! We are dedicated to providing the best services to our customers. Our mission is to deliver high-quality products and services that meet your needs.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our team is passionate, experienced, and committed to excellence. We value customer satisfaction and strive to exceed expectations in everything we do.
            </p>
            <p className="text-lg leading-relaxed">
              Thank you for choosing <span className="font-semibold text-yellow-400">[Company Name]</span>. We look forward to serving you and building a lasting relationship.
            </p>
          </div>
          <div>
            <img 
              src="https://via.placeholder.com/500" 
              alt="Company" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
