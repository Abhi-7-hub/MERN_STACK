import React, { useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const {
    backendUrl,
    getUserData,
    isLoggedin,
    userData
  } = useContext(AppContext);

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otp = inputRefs.current.map((ref) => ref.value).join('');
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  const handleInput = (e, index) => {
    if (e.target.value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    pasted.split('').forEach((digit, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
    e.preventDefault();
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50'>
      {/* Logo */}
      <motion.img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className='w-32 sm:w-40 cursor-pointer mb-8'
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Main Card */}
      <motion.div 
        className='bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className='text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Email Verification
        </motion.h2>
        
        <motion.p 
          className='text-gray-600 text-center mb-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          We've sent a 6-digit code to your email address
        </motion.p>

        <form onSubmit={onSubmitHandler} onPaste={handlePaste} className='space-y-6'>
          <motion.div
            className='flex justify-between mb-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type='text'
                maxLength='1'
                required
                className='w-12 h-12 border-2 border-gray-300 text-center text-xl rounded-md focus:border-blue-500 outline-none'
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </motion.div>

          <motion.button
            type='submit'
            className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Verify Email
          </motion.button>
        </form>

        <motion.div 
          className='mt-6 text-center text-gray-500 text-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Didn't receive code?{' '}
          <button 
            className='text-blue-600 font-medium hover:underline'
            onClick={() => navigate('/resend-otp')}
          >
            Resend OTP
          </button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        className='mt-8 text-center text-gray-500 text-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        © {new Date().getFullYear()} Speakly. All rights reserved.
      </motion.div>
    </div>
  );
};

export default EmailVerify;