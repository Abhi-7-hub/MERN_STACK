import React, { useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext'; // Adjust if needed
import { assets } from '../assets/assets'; // Adjust if needed

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
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <form
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'
        onSubmit={onSubmitHandler}
        onPaste={handlePaste}
      >
        <h1 className='text-2xl font-bold mb-3 text-center text-white'>Email Verification OTP</h1>
        <p className='text-gray-300 mb-6 text-center'>
          Enter the 6-digit code sent to your email address.
        </p>

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
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
