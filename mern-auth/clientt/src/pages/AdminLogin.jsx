import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Theme configurations (matching Home page)
  const themes = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 to-gray-800",
      card: "bg-gray-800",
      text: "text-white",
      input: "bg-gray-700 text-white border-gray-600 placeholder-gray-400",
      button: "bg-indigo-600 hover:bg-indigo-700",
      link: "text-indigo-400 hover:text-indigo-300",
      accent: "from-indigo-500 to-purple-500"
    },
    light: {
      bg: "bg-gradient-to-br from-blue-50 to-purple-50",
      card: "bg-white",
      text: "text-gray-800",
      input: "bg-white text-gray-800 border-gray-300 placeholder-gray-500",
      button: "bg-blue-600 hover:bg-blue-700",
      link: "text-blue-600 hover:text-blue-800",
      accent: "from-blue-500 to-purple-500"
    },
    sunset: {
      bg: "bg-gradient-to-br from-orange-100 to-pink-100",
      card: "bg-orange-50",
      text: "text-gray-800",
      input: "bg-white text-gray-800 border-orange-200 placeholder-orange-400",
      button: "bg-orange-500 hover:bg-orange-600",
      link: "text-orange-600 hover:text-orange-800",
      accent: "from-orange-400 to-pink-400"
    },
    forest: {
      bg: "bg-gradient-to-br from-green-50 to-teal-50",
      card: "bg-green-50",
      text: "text-gray-800",
      input: "bg-white text-gray-800 border-green-200 placeholder-green-400",
      button: "bg-green-600 hover:bg-green-700",
      link: "text-green-600 hover:text-green-800",
      accent: "from-green-500 to-teal-500"
    }
  };

  // Get theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }

    // Listen for theme changes
    const handleThemeChange = (e) => {
      if (e.detail && themes[e.detail]) {
        setCurrentTheme(e.detail);
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (isRegistering) {
        const response = await axios.post(
          `${backendUrl}/api/admin/register`,
          { name, email, password },
          { withCredentials: true }
        );
        data = response.data;
      } else {
        const response = await axios.post(
          `${backendUrl}/api/admin/login`,
          { email, password },
          { withCredentials: true }
        );
        data = response.data;
      }

      if (data.success) {
        setUserData(data.admin || data.user);
        setIsLoggedin(true);
        toast.success(isRegistering ? "Registered successfully!" : "Logged in successfully!");
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error.response?.data?.message || "Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${themes[currentTheme].bg} p-4`}>
      <div className={`shadow-xl rounded-2xl p-6 w-full max-w-md ${themes[currentTheme].card} ${themes[currentTheme].text}`}>
        
        {/* Header with Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-center">
            {isRegistering ? "Admin Registration" : "Admin Login"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 p-3 border rounded-lg ${themes[currentTheme].input}`}
                required
              />
            </div>
          )}
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 p-3 border rounded-lg ${themes[currentTheme].input}`}
              required
            />
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 p-3 border rounded-lg ${themes[currentTheme].input}`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center ${
              loading ? "bg-gray-400 cursor-not-allowed" : themes[currentTheme].button
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isRegistering ? "Registering..." : "Logging in..."}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {isRegistering ? "Register" : "Login"}
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className={`text-sm flex items-center justify-center ${themes[currentTheme].link}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {isRegistering 
              ? "Already have an account? Login here" 
              : "Need an admin account? Register here"
            }
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className={`text-sm flex items-center justify-center ${themes[currentTheme].link}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;