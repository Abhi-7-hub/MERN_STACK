import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center justify-center mt-20 px-6 sm:px-12 text-center max-w-5xl mx-auto'>
      {/* User Image */}
      <img
        src={assets.header_img}
        alt='User Avatar'
        className='w-36 h-36 rounded-full mb-6 shadow-lg border-4 border-white'
      />

      {/* Greeting */}
      <h1 className='flex items-center gap-2 text-2xl sm:text-4xl font-bold text-black mb-3'>
        Hello {userData?.name || 'User'}!
        <img src={assets.hand_wave} alt='Wave' className='w-8 h-8' />
      </h1>

      {/* Main Heading */}
      <h2 className='text-2xl sm:text-4xl font-semibold text-blue-800 mb-5'>
        Welcome to My JWT Authentication System App
      </h2>

      {/* Description */}
      <p className='text-base sm:text-lg text-gray-800 leading-relaxed mb-8 max-w-3xl'>
        This project is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that demonstrates a secure user authentication flow using JWT (JSON Web Tokens). It includes a modern React frontend styled with Tailwind CSS and handles routing using React Router DOM. The backend is built using Express and Node.js, with MongoDB Atlas for data storage. The app includes features like user registration, login, protected routes, persistent sessions using cookies, and role-based access.
      </p>

      {/* Button */}
      <button className='px-8 py-3 text-white text-lg font-medium bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition duration-300'>
        Get Started
      </button>
    </div>
  );
};

export default Header;
