import React, { useContext, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    <div className='flex flex-col items-center justify-center min-h-screen gap-8 px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Logo'
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {!isEmailSent && (
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitEmail}>
          <h1 className='text-2xl font-bold mb-3 text-center text-white'>Reset Password</h1>
          <p className='text-gray-300 mb-6 text-center'>Enter your registered email to reset password.</p>

          <div className='mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='Mail Icon' className='w-4 h-4' />
            <input
              type='email'
              placeholder='Email ID'
              className='flex-1 bg-transparent text-white placeholder-gray-400 outline-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'
          >
            Send Reset Link
          </button>
        </form>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <form
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
          onSubmit={onSubmitOTP}
          onPaste={handlePaste}
        >
          <h1 className='text-2xl font-bold mb-3 text-center text-white'>Reset Password OTP</h1>
          <p className='text-gray-300 mb-6 text-center'>Enter the 6-digit code sent to your email address.</p>

          <div className='flex justify-between mb-8'>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type='text'
                maxLength='1'
                required
                name={`otp-${index}`}
                id={`otp-${index}`}
                autoComplete='one-time-code'
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button type='submit' className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit OTP
          </button>
        </form>
      )}

      {isOtpSubmitted && (
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitNewPassword}>
          <h1 className='text-2xl font-bold mb-3 text-center text-white'>New Password</h1>
          <p className='text-gray-300 mb-6 text-center'>Enter new password below.</p>

          <div className='mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='Lock Icon' className='w-4 h-4' />
            <input
              type='password'
              placeholder='New password'
              className='flex-1 bg-transparent text-white placeholder-gray-400 outline-none'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;