import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      let response;

      if (state === 'Sign Up') {
        response = await axios.post(backendUrl + '/api/auth/register', {
          name,
          email,
          password,
        });
      } else {
        response = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password,
        });
      }

      const { data } = response;

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server Error');
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
        {/* Title */}
        <motion.h2 
          className='text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {state === 'Sign Up' ? 'Join Speakly' : 'Welcome Back'}
        </motion.h2>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className='space-y-5'>
          {state === 'Sign Up' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className='block text-gray-700 mb-1'>Full Name</label>
              <div className='flex items-center border-b-2 border-gray-300 py-2'>
                <img src={assets.person_icon} alt="Person" className='h-5 w-5 text-gray-500 mr-2' />
                <input
                  type='text'
                  placeholder='Enter your name'
                  className='w-full outline-none text-gray-700'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: state === 'Sign Up' ? 0.4 : 0.3 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: state === 'Sign Up' ? 0.5 : 0.4 }}
          >
            <label className='block text-gray-700 mb-1'>Password</label>
            <div className='flex items-center border-b-2 border-gray-300 py-2'>
              <img src={assets.lock_icon} alt="Lock" className='h-5 w-5 text-gray-500 mr-2' />
              <input
                type='password'
                placeholder='Enter your password'
                className='w-full outline-none text-gray-700'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </motion.div>

          {state === 'Login' && (
            <motion.div
              className='text-right'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type='button'
                onClick={() => navigate('/reset-password')}
                className='text-sm text-blue-600 hover:underline'
              >
                Forgot password?
              </button>
            </motion.div>
          )}

          <motion.button
            type='submit'
            className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: state === 'Sign Up' ? 0.6 : 0.5 }}
          >
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </motion.button>
        </form>

        <motion.div 
          className='mt-6 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {state === 'Sign Up' ? (
            <p className='text-gray-600'>
              Already have an account?{' '}
              <button
                onClick={() => setState('Login')}
                className='text-blue-600 font-medium hover:underline'
              >
                Login here
              </button>
            </p>
          ) : (
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <button
                onClick={() => setState('Sign Up')}
                className='text-blue-600 font-medium hover:underline'
              >
                Sign up
              </button>
            </p>
          )}
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

export default Login;