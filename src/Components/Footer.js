import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start flex-wrap">
          {/* Column 1: Company Info */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h5 className="font-bold text-lg">Company Name</h5>
            <p className="text-sm">© 2025 All rights reserved.</p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h5 className="font-bold text-lg">Quick Links</h5>
            <ul className="text-sm">
            <li className="my-2"><Link to="/about" className="hover:underline">About Us</Link></li>
            <li className="my-2"><a href="/services" className="hover:underline">Services</a></li>
              <li className="my-2"><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h5 className="font-bold text-lg">Follow Us</h5>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-gray-400">Facebook</a></li>
              <li><a href="#" className="hover:text-gray-400">Twitter</a></li>
              <li><a href="#" className="hover:text-gray-400">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
