import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext)

  const sendVerificationotp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp', {
        userId: userData._id,
      })

      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setIsLoggedin(false)
        setUserData(null)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50'>
      {/* Logo */}
      <img src={assets.logo} alt="logo" className='w-28 sm:w-32 cursor-pointer' onClick={() => navigate('/')} />

      {/* Right Section */}
      {userData && userData.name ? (
        <div className='flex items-center gap-4'>

          {/* Gemini AI Button */}
          <button
            onClick={() => navigate('/gemini-search')}
            className='bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all text-sm'
          >
            Gemini AI
          </button>

          {/* Avatar Dropdown */}
          <div className='relative group'>
            <div className='w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-bold text-lg cursor-pointer'>
              {userData.name[0].toUpperCase()}
            </div>
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm shadow-md rounded-md'>

                {/* Show Verify Email if not verified */}
                {userData.isAccountVerified === false && (
                  <li
                    onClick={sendVerificationotp}
                    className='py-1 px-2 hover:bg-gray-200 cursor-pointer'
                  >
                    Verify Email
                  </li>
                )}

                {/* Logout */}
                <li
                  onClick={logout}
                  className='py-1 px-2 hover:bg-gray-200 cursor-pointer'
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
        >
          Login <img src={assets.arrow_icon} alt="arrow" />
        </button>
      )}
    </div>
  )
}

export default Navbar
