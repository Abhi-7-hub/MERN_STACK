import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin, getUserData } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const sendVerificationotp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp', {
        userId: userData._id,
      });

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/login', {
        email,
        password,
      });

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        setShowLoginForm(false);
        toast.success('Logged in successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50'>
      {/* Logo */}
      <img 
        src={assets.logo} 
        alt="logo" 
        className='w-28 sm:w-32 cursor-pointer transition-transform hover:scale-105' 
        onClick={() => navigate('/')} 
      />

      {/* Right Section */}
      {userData && userData.name ? (
        <div className='flex items-center gap-4'>
          {/* Gemini AI Button */}
          <motion.button
            onClick={() => navigate('/gemini-search')}
            className='bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all text-sm'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Gemini AI
          </motion.button>

          {/* Avatar Dropdown */}
          <div className='relative'>
            <motion.div
              className='w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-bold text-lg cursor-pointer'
              onClick={() => setShowDropdown(!showDropdown)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {userData.name[0].toUpperCase()}
            </motion.div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-20 overflow-hidden'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className='py-1'>
                    <motion.li
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center'
                      onClick={() => {
                        navigate('/feed');
                        setShowDropdown(false);
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <img src={assets.logo} alt="Feed" className='w-4 h-4 mr-2' />
                      Community Feed
                    </motion.li>
                    <motion.li
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center'
                      onClick={() => {
                        navigate(`/user/${userData._id}`);
                        setShowDropdown(false);
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <img src={assets.person_icon} alt="Profile" className='w-4 h-4 mr-2' />
                      My Profile
                    </motion.li>
                    {userData.isAccountVerified === false && (
                      <motion.li
                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center'
                        onClick={() => {
                          sendVerificationotp();
                          setShowDropdown(false);
                        }}
                        whileHover={{ x: 5 }}
                      >
                        <img src={assets.mail_icon} alt="Verify" className='w-4 h-4 mr-2' />
                        Verify Email
                      </motion.li>
                    )}
                    <motion.li
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 flex items-center'
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <img src={assets.lock_icon} alt="Logout" className='w-4 h-4 mr-2' />
                      Logout
                    </motion.li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className='relative'>
          <motion.button
            onClick={() => setShowLoginForm(!showLoginForm)}
            className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login <img src={assets.arrow_icon} alt="arrow" className='w-3 h-3' />
          </motion.button>

          {/* Login Dropdown Form */}
          <AnimatePresence>
            {showLoginForm && (
              <motion.div
                className='absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-20 p-4'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className='text-lg font-semibold mb-3 text-gray-800 flex items-center'>
                  <img src={assets.login_icon} alt="Login" className='w-5 h-5 mr-2' />
                  Login to Speakly
                </h3>
                <form onSubmit={handleLogin}>
                  <div className='mb-3'>
                    <div className='flex items-center border-b-2 border-gray-300 py-2'>
                      <img src={assets.mail_icon} alt="Email" className='w-4 h-4 mr-2 text-gray-500' />
                      <input
                        type='email'
                        placeholder='Email'
                        className='w-full outline-none text-gray-700'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className='mb-4'>
                    <div className='flex items-center border-b-2 border-gray-300 py-2'>
                      <img src={assets.lock_icon} alt="Password" className='w-4 h-4 mr-2 text-gray-500' />
                      <input
                        type='password'
                        placeholder='Password'
                        className='w-full outline-none text-gray-700'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <motion.button
                    type='submit'
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-md hover:shadow-md transition-all'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.button>
                </form>
                <p className='text-xs text-gray-500 mt-3 flex items-center'>
                  <img src={assets.info_icon} alt="Info" className='w-3 h-3 mr-1' />
                  Don't have an account?{' '}
                  <span 
                    className='text-blue-600 cursor-pointer font-medium ml-1'
                    onClick={() => {
                      setShowLoginForm(false);
                      navigate('/login');
                    }}
                  >
                    Sign up
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Navbar;