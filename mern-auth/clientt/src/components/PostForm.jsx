import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostForm = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Theme configurations (matching Home page)
  const themes = {
    dark: {
      bg: "bg-gray-800",
      text: "text-white",
      button: "bg-gradient-to-r from-indigo-600 to-purple-600",
      border: "border-gray-700",
      placeholder: "placeholder-gray-400"
    },
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      button: "bg-gradient-to-r from-blue-500 to-blue-600",
      border: "border-gray-300",
      placeholder: "placeholder-gray-500"
    },
    sunset: {
      bg: "bg-orange-100",
      text: "text-gray-800",
      button: "bg-gradient-to-r from-orange-500 to-pink-500",
      border: "border-orange-300",
      placeholder: "placeholder-orange-400"
    },
    forest: {
      bg: "bg-green-50",
      text: "text-gray-800",
      button: "bg-gradient-to-r from-green-600 to-emerald-600",
      border: "border-green-300",
      placeholder: "placeholder-green-400"
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
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/posts`, { content });
      if (data.success) {
        toast.success('Post created successfully');
        setContent('');
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-xl shadow-xl p-5 mb-6 ${themes[currentTheme].bg} ${themes[currentTheme].text}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
          {userData?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <form className="flex-1" onSubmit={handleSubmit}>
          <textarea
            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 resize-none transition-all ${themes[currentTheme].border} ${themes[currentTheme].bg} ${themes[currentTheme].text} ${themes[currentTheme].placeholder}`}
            placeholder="What's on your mind?"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          {/* New Post Options */}
          <div className="flex justify-between mt-2 text-gray-500 text-sm">
            <button type="button" className="hover:text-red-500 transition-all">❤️ Feeling</button>
            <button type="button" className="hover:text-blue-500 transition-all">📸 Photo/Video</button>
          </div>

          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 ${themes[currentTheme].button} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform disabled:opacity-50`}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;