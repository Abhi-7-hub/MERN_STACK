import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
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
        response = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
      } else {
        response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
      }

      const { data } = response;

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate('/feed');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server Error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70 p-10 rounded-3xl shadow-2xl w-full max-w-md mx-4 backdrop-blur-sm">
        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center leading-tight drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {state === 'Sign Up' ? 'Join Speakly' : 'Welcome Back'}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-gray-300 text-center mb-8"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Connect, share, and grow with your professional network.
        </motion.p>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="w-full space-y-5">
          {state === 'Sign Up' && (
            <motion.input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg outline-none text-gray-900 placeholder-gray-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            />
          )}

          <motion.input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg outline-none text-gray-900 placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: state === 'Sign Up' ? 0.4 : 0.3 }}
          />

          <motion.input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg outline-none text-gray-900 placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: state === 'Sign Up' ? 0.5 : 0.4 }}
          />

          {state === 'Login' && (
            <motion.div
              className="text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="button"
                onClick={() => navigate('/reset-password')}
                className="text-sm text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: state === 'Sign Up' ? 0.6 : 0.5 }}
          >
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </motion.button>
        </form>

        <motion.div
          className="mt-6 text-center text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {state === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setState('Login')}
                className="text-blue-400 font-medium hover:underline"
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setState('Sign Up')}
                className="text-blue-400 font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center text-gray-300 text-sm"
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
