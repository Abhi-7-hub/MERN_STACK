import React, { useContext, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const inputRefs = useRef([]);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6);
    const digits = paste.split('');
    digits.forEach((digit, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = digit;
      }
    });
    if (inputRefs.current[digits.length - 1]) {
      inputRefs.current[digits.length - 1].focus();
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      data.success ? toast.success(data.success) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current.map((input) => input.value).join('');
    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
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
        {!isEmailSent ? (
          <>
            {/* Email Request Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className='text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Reset Password
              </h2>
              <p className='text-gray-600 text-center mb-6'>
                Enter your registered email to receive a reset code
              </p>

              <form onSubmit={onSubmitEmail} className='space-y-5'>
                <div>
                  <label className='block text-gray-700 mb-1'>Email</label>
                  <div className='flex items-center border-b-2 border-gray-300 py-2'>
                    <img src={assets.mail_icon} alt="Mail" className='h-5 w-5 text-gray-500 mr-2' />
                    <input
                      type='email'
                      placeholder='Enter your email'
                      className='w-full outline-none text-gray-700'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type='submit'
                  className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Reset Code
                </motion.button>
              </form>
            </motion.div>
          </>
        ) : !isOtpSubmitted ? (
          <>
            {/* OTP Verification Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className='text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Enter Verification Code
              </h2>
              <p className='text-gray-600 text-center mb-6'>
                We sent a 6-digit code to {email}
              </p>

              <form onSubmit={onSubmitOTP} onPaste={handlePaste} className='space-y-5'>
                <div className='flex justify-between mb-6'>
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
                </div>

                <motion.button
                  type='submit'
                  className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verify Code
                </motion.button>
              </form>
            </motion.div>
          </>
        ) : (
          <>
            {/* New Password Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className='text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Create New Password
              </h2>
              <p className='text-gray-600 text-center mb-6'>
                Enter a new password for your account
              </p>

              <form onSubmit={onSubmitNewPassword} className='space-y-5'>
                <div>
                  <label className='block text-gray-700 mb-1'>New Password</label>
                  <div className='flex items-center border-b-2 border-gray-300 py-2'>
                    <img src={assets.lock_icon} alt="Lock" className='h-5 w-5 text-gray-500 mr-2' />
                    <input
                      type='password'
                      placeholder='Enter new password'
                      className='w-full outline-none text-gray-700'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type='submit'
                  className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset Password
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
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

export default ResetPassword;