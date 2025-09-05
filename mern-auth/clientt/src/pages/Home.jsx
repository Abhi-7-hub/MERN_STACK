import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const { isLoggedin } = useContext(AppContext);
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState('dark'); // Default theme
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  // Theme configurations
  const themes = {
    dark: {
      bg: 'bg-[url("/bg_img.png")]',
      overlay: 'bg-black bg-opacity-40',
      text: 'text-white',
      accent: 'text-indigo-500',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      scrollIndicator: 'bg-white'
    },
    light: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      overlay: 'bg-white bg-opacity-20',
      text: 'text-gray-800',
      accent: 'text-blue-600',
      button: 'bg-blue-500 hover:bg-blue-600',
      scrollIndicator: 'bg-blue-500'
    },
    sunset: {
      bg: 'bg-gradient-to-br from-orange-400 to-pink-600',
      overlay: 'bg-black bg-opacity-20',
      text: 'text-white',
      accent: 'text-yellow-300',
      button: 'bg-pink-500 hover:bg-pink-600',
      scrollIndicator: 'bg-yellow-300'
    },
    forest: {
      bg: 'bg-gradient-to-br from-green-900 to-teal-800',
      overlay: 'bg-black bg-opacity-30',
      text: 'text-white',
      accent: 'text-emerald-300',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      scrollIndicator: 'bg-emerald-300'
    }
  };

  // ✅ Handle Get Started button click
  const handleGetStarted = () => {
    if (isLoggedin) {
      navigate('/feed');
    } else {
      navigate('/login');
    }
  };

  // Theme selector component
  const ThemeSelector = () => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-16 right-4 bg-white p-4 rounded-lg shadow-lg z-10"
    >
      <h3 className="font-semibold text-gray-800 mb-2">Select Theme</h3>
      <div className="flex gap-2">
        {Object.keys(themes).map(theme => (
          <button
            key={theme}
            onClick={() => setCurrentTheme(theme)}
            className={`w-8 h-8 rounded-full border-2 ${
              currentTheme === theme ? 'border-gray-800' : 'border-transparent'
            }`}
            style={{
              background: `linear-gradient(135deg, ${themes[theme].bg})`
            }}
            title={theme.charAt(0).toUpperCase() + theme.slice(1)}
          />
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className={`flex flex-col min-h-screen ${themes[currentTheme].bg} bg-cover bg-center`}>
      {/* Navbar only if not logged in */}
      {!isLoggedin && <Navbar />}
      
      {/* Theme selector button */}
      {!isLoggedin && (
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => setIsThemeSelectorOpen(!isThemeSelectorOpen)}
            className="p-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
          {isThemeSelectorOpen && <ThemeSelector />}
        </div>
      )}

      {/* Hero Section */}
      <div className={`flex flex-col items-center justify-center flex-1 text-center px-4 md:px-20 lg:px-40 py-20 ${themes[currentTheme].overlay}`}>
        {/* Main Heading */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className={`text-5xl md:text-6xl font-extrabold ${themes[currentTheme].text} mb-6 leading-tight drop-shadow-lg`}
        >
          Welcome to <span className={themes[currentTheme].accent}>Gemini</span> Platform
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`text-lg md:text-xl ${themes[currentTheme].text === 'text-white' ? 'text-gray-200' : 'text-gray-600'} mb-8`}
        >
          Discover, connect, and share your thoughts with a professional network built for you. 
          Engage, learn, and grow — all in one platform.
        </motion.p>

        {/* Get Started Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <button
            onClick={handleGetStarted}
            className={`px-8 py-4 ${themes[currentTheme].button} text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105`}
          >
            Get Started
          </button>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className='absolute bottom-10 left-1/2 transform -translate-x-1/2'
      >
        <div className={`w-3 h-3 rounded-full ${themes[currentTheme].scrollIndicator} animate-bounce`}></div>
      </motion.div>
    </div>
  );
};

export default Home;