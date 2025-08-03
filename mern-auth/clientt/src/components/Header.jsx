// src/components/Header.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaGithub } from "react-icons/fa";

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 text-center mx-auto"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* App Name with Special Styling */}
        <motion.h1 
          className="text-5xl sm:text-7xl font-bold mb-8"
          variants={item}
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Speakly
          </span>
        </motion.h1>

        {/* Famous Quote */}
        <motion.blockquote 
          className="text-xl sm:text-2xl italic text-gray-600 mb-12 max-w-2xl"
          variants={item}
        >
          "Communication works for those who work at it." 
          <footer className="mt-2 text-sm not-italic text-gray-500">- John Powell</footer>
        </motion.blockquote>

        {/* App Description */}
        <motion.div className="max-w-3xl mb-12" variants={item}>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
            What is Speakly?
          </h2>
          <p className="text-gray-600">
            Speakly is a modern communication platform that helps you connect, share, and engage with your community.
            Join thousands of users who are already experiencing seamless social interaction with our secure authentication system.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate('/feed')}
          className="px-8 py-3 text-white text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join the Community
        </motion.button>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-xl font-semibold">Abhishek Pratap Singh</h2>
              <p className="text-gray-400 mt-1">MERN Stack Developer from India</p>
            </div>

            <div className="flex space-x-6">
              <a href="https://www.facebook.com/abhll/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/abhi_2n/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/abhishek-pratap-singh-17a17a140/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedinIn className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/channel/UCUxsYGBn4yXpcp_VIwB5SFg" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
              <a href="https://github.com/Abhi-7-hub" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Speakly. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Header;