import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedin, getUserData, isLoggedin, backendUrl } =
    useContext(AppContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentTheme, setCurrentTheme] = useState('dark'); // Default theme

  // Theme configurations (should match Home page)
  const themes = {
    dark: {
      bg: "bg-gray-900",
      text: "text-white",
      button: "bg-indigo-600 hover:bg-indigo-700",
      accent: "text-indigo-400",
      border: "border-gray-700",
      dropdown: "bg-gray-800",
      hover: "hover:bg-gray-700"
    },
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      button: "bg-blue-500 hover:bg-blue-600",
      accent: "text-blue-500",
      border: "border-gray-200",
      dropdown: "bg-white",
      hover: "hover:bg-gray-100"
    },
    sunset: {
      bg: "bg-orange-500",
      text: "text-white",
      button: "bg-pink-500 hover:bg-pink-600",
      accent: "text-yellow-300",
      border: "border-orange-400",
      dropdown: "bg-orange-400",
      hover: "hover:bg-orange-600"
    },
    forest: {
      bg: "bg-green-800",
      text: "text-white",
      button: "bg-emerald-600 hover:bg-emerald-700",
      accent: "text-emerald-300",
      border: "border-green-700",
      dropdown: "bg-green-700",
      hover: "hover:bg-green-600"
    }
  };

  // Get theme from localStorage or use default
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Listen for theme changes from Home component
  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && themes[e.detail]) {
        setCurrentTheme(e.detail);
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const sendVerificationotp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate("/");
        toast.success("Logged out successfully");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        setShowLoginForm(false);
        toast.success("Logged in successfully");
        navigate("/feed");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={`w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 fixed top-0 z-50
      ${themes[currentTheme].bg} ${themes[currentTheme].text} shadow-sm border-b ${themes[currentTheme].border}`}>

      {/* Website Name with Icon */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-bold transition-transform hover:scale-105">
          Speakly
        </h1>
      </div>

      {/* Right Section */}
      {isLoggedin && userData ? (
        <div className="flex items-center gap-4 relative">
          {userData.role === "admin" && (
            <motion.button
              onClick={() => navigate("/gemini-search")}
              className={`${themes[currentTheme].button} px-4 py-2 rounded-lg text-white transition-all text-sm shadow-sm flex items-center gap-2`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Gemini AI
            </motion.button>
          )}

          <div className="relative">
            <motion.div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${themes[currentTheme].button} text-white font-semibold text-lg cursor-pointer shadow`}
              onClick={() => setShowDropdown(!showDropdown)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {userData.name[0].toUpperCase()}
            </motion.div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className={`absolute right-0 mt-2 w-64 ${themes[currentTheme].dropdown} rounded-xl shadow-lg z-20 overflow-hidden ${themes[currentTheme].text}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className="py-2">
                    <li
                      className={`px-4 py-2 ${themes[currentTheme].hover} cursor-pointer flex items-center gap-3 rounded-md transition-colors`}
                      onClick={() => {
                        navigate("/feed");
                        setShowDropdown(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      Community Feed
                    </li>
                    <li
                      className={`px-4 py-2 ${themes[currentTheme].hover} cursor-pointer flex items-center gap-3 rounded-md transition-colors`}
                      onClick={() => {
                        navigate(`/user/${userData._id}`);
                        setShowDropdown(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </li>
                    {userData.role === "admin" && (
                      <li
                        className={`px-4 py-2 ${themes[currentTheme].hover} cursor-pointer flex items-center gap-3 rounded-md transition-colors`}
                        onClick={() => {
                          navigate("/admin");
                          setShowDropdown(false);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                      </li>
                    )}
                    {!userData.isAccountVerified && (
                      <li
                        className={`px-4 py-2 ${themes[currentTheme].hover} cursor-pointer flex items-center gap-3 rounded-md transition-colors`}
                        onClick={() => {
                          sendVerificationotp();
                          setShowDropdown(false);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Verify Email
                      </li>
                    )}
                    <li
                      className={`px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-3 rounded-md text-red-600 transition-colors`}
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <motion.button
            onClick={() => setShowLoginForm(!showLoginForm)}
            className={`px-6 py-2 ${themes[currentTheme].button} text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            User Login
          </motion.button>
          <motion.button
            onClick={() => navigate("/admin-login")}
            className={`px-6 py-2 ${themes[currentTheme].button} text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Login
          </motion.button>

          <AnimatePresence>
            {showLoginForm && (
              <motion.div
                className={`absolute right-0 mt-2 w-72 ${themes[currentTheme].dropdown} rounded-xl shadow-lg z-20 p-4 ${themes[currentTheme].text}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  User Login
                </h3>
                <form onSubmit={handleLogin}>
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      className={`w-full pl-10 border-b ${themes[currentTheme].border} py-2 outline-none focus:border-blue-500 transition-colors bg-transparent`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      className={`w-full pl-10 border-b ${themes[currentTheme].border} py-2 outline-none focus:border-blue-500 transition-colors bg-transparent`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className={`w-full ${themes[currentTheme].button} text-white py-2 rounded-md hover:shadow-md transition-all flex items-center justify-center gap-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </motion.button>
                </form>
                <p className="text-sm text-center mt-3">
                  Don't have an account?{" "}
                  <span
                    className={`${themes[currentTheme].accent} cursor-pointer hover:underline`}
                    onClick={() => navigate("/login")}
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