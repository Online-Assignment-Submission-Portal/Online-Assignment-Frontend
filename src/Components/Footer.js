import React from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 pb-6">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h5 className="font-bold text-lg">CollegeHub</h5>
          <p className="text-sm mt-2">
            <span className="text-lg text-violet-600">
              <i className="ri-copyright-line"></i>
            </span>{" "}
            2025 All rights reserved.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-lg">Quick Links</h5>
          <ul className="text-sm mt-2 space-y-1">
            <li>
              <Link to="/about" className="hover:underline flex items-center">
                <span className="text-violet-600 mr-2">
                  <i className="ri-information-line"></i>
                </span>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:underline flex items-center">
                <span className="text-violet-600 mr-2">
                  <i className="ri-customer-service-fill"></i>
                </span>
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline flex items-center">
                <span className="text-violet-600 mr-2">
                  <i className="ri-contacts-book-3-fill"></i>
                </span>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-lg">Follow Us</h5>
          <ul className="text-sm mt-2 space-y-1">
            <li>
              <a href="#" className="hover:text-gray-400 flex items-center">
                <span className="text-violet-600 mr-2">
                  <i className="ri-facebook-box-fill"></i>
                </span>
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400 flex items-center">
                <span className="text-violet-600 mr-2">
                  <i className="ri-twitter-x-line"></i>
                </span>
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400 flex items-center">
                <span className="text-violet-600 mr-2">
                  <i className="ri-instagram-line"></i>
                </span>
                 Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-lg">College Links</h5>
          <ul className="text-sm mt-2 space-y-1">
            <li>
              <a
                href="https://www.bitmesra.ac.in/"
                className="hover:text-gray-400 flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-violet-600 mr-2">
                  <i className="ri-global-line"></i>
                </span>
                BIT Mesra Website
              </a>
            </li>
            <li>
              <a
                href="https://erpportal.bitmesra.ac.in/login.htm"
                className="hover:text-gray-400 flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-violet-600 mr-2">
                  <i className="ri-computer-line"></i>
                </span>
                ERP Portal
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
