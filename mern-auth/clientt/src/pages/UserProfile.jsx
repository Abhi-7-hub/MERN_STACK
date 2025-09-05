import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Theme configurations (matching Home page)
  const themes = {
    dark: {
      bg: "bg-gray-900",
      card: "bg-gray-800",
      text: "text-white",
      accent: "text-indigo-400",
      border: "border-gray-700",
      spinner: "border-indigo-500"
    },
    light: {
      bg: "bg-gray-100",
      card: "bg-white",
      text: "text-gray-900",
      accent: "text-blue-500",
      border: "border-gray-200",
      spinner: "border-blue-500"
    },
    sunset: {
      bg: "bg-orange-50",
      card: "bg-orange-100",
      text: "text-gray-900",
      accent: "text-orange-500",
      border: "border-orange-200",
      spinner: "border-orange-500"
    },
    forest: {
      bg: "bg-green-50",
      card: "bg-green-100",
      text: "text-gray-900",
      accent: "text-green-500",
      border: "border-green-200",
      spinner: "border-green-500"
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, {
          params: { userId }
        });
        if (data.success) {
          setProfileUser(data.userData);
        } else {
          navigate('/feed');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch user data');
        navigate('/feed');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [backendUrl, userId, navigate]);

  if (loading) return (
    <div className={`min-h-screen ${themes[currentTheme].bg}`}>
      <Navbar />
      <div className="flex justify-center py-20">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${themes[currentTheme].spinner}`}></div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${themes[currentTheme].bg}`}>
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">

        {/* Profile Card */}
        <div className={`rounded-lg shadow-md p-6 mb-6 flex items-center space-x-4 ${themes[currentTheme].card} ${themes[currentTheme].text}`}>
          {/* Initials Circle */}
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
            {profileUser.name ? profileUser.name.charAt(0).toUpperCase() : 'U'}
          </div>

          {/* Name & verification */}
          <div>
            <h1 className="text-2xl font-bold">{profileUser.name}</h1>
            <p className={`text-sm font-medium ${profileUser.isAccountVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {profileUser.isAccountVerified ? 'Verified Account' : 'Unverified Account'}
            </p>
          </div>
        </div>

        {/* Post Form for owner */}
        {userData?._id === userId && <PostForm />}

        {/* Posts Header */}
        <h2 className={`text-xl font-semibold mb-4 ${themes[currentTheme].text}`}>
          {userData?._id === userId ? 'Your Posts' : `${profileUser.name}'s Posts`}
        </h2>

        {/* Posts List */}
        <PostList userId={userId} showAuthor={false} />
      </div>
    </div>
  );
};

export default UserProfile;