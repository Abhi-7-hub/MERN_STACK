import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn } = useContext(AppContext);

  const [state, setState] = useState('Sign Up'); // "Sign Up" or "Login"
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form submit handler
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
        setIsLoggedIn(true);
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
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {/* Main Card */}
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        {/* Title */}
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}
        </p>

        {/* Form */}
        <form onSubmit={onSubmitHandler}>

          {/* Name field only for Sign Up */}
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] shadow-sm'>
              <img src={assets.person_icon} alt="Person Icon" />
              <input
                type='text'
                placeholder='Full Name'
                className='bg-transparent outline-none text-white w-full'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email */}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] shadow-sm'>
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              type='email'
              placeholder='Email id'
              className='bg-transparent outline-none text-white w-full'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] shadow-sm'>
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              type='password'
              placeholder='Password'
              className='bg-transparent outline-none text-white w-full'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot password */}
          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-indigo-400 cursor-pointer text-right text-xs'
          >
            Forgot password?
          </p>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
          >
            {state}
          </button>
        </form>

        {/* Switch between Sign Up and Login */}
        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Already have an account?{' '}
            <span
              className='text-blue-400 cursor-pointer underline'
              onClick={() => setState('Login')}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Don’t have an account?{' '}
            <span
              className='text-blue-400 cursor-pointer underline'
              onClick={() => setState('Sign Up')}
            >
              Signup
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
