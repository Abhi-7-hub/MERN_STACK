import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PostList = ({ userId, showAuthor = true }) => {
  const { backendUrl, userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Theme configurations (matching Home page)
  const themes = {
    dark: {
      bg: "bg-gray-800",
      text: "text-white",
      border: "border-gray-700",
      hover: "hover:bg-gray-700",
      button: "text-gray-300 hover:text-white"
    },
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      border: "border-gray-200",
      hover: "hover:bg-gray-100",
      button: "text-gray-500 hover:text-gray-700"
    },
    sunset: {
      bg: "bg-orange-100",
      text: "text-gray-800",
      border: "border-orange-200",
      hover: "hover:bg-orange-200",
      button: "text-orange-600 hover:text-orange-800"
    },
    forest: {
      bg: "bg-green-50",
      text: "text-gray-800",
      border: "border-green-200",
      hover: "hover:bg-green-100",
      button: "text-green-600 hover:text-green-800"
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

  const fetchPosts = async () => {
    try {
      const endpoint = userId 
        ? `${backendUrl}/api/posts/user/${userId}`
        : `${backendUrl}/api/posts`;
      
      const { data } = await axios.get(endpoint, { withCredentials: true });
      if (data.success) setPosts(data.posts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [backendUrl, userId]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const url = userData?.role === 'admin' 
        ? `${backendUrl}/api/admin/posts/${postId}` 
        : `${backendUrl}/api/posts/${postId}`;

      const { data } = await axios.delete(url, { withCredentials: true });

      if (data.success) {
        toast.success('Post deleted successfully');
        setPosts(posts.filter(post => post._id !== postId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <div key={post._id} className={`rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow ${themes[currentTheme].bg} ${themes[currentTheme].text}`}>
          {showAuthor && post.author && (
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Link 
                  to={`/user/${post.author._id}`} 
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white"
                >
                  {post.author?.name?.[0]?.toUpperCase() || 'U'}
                </Link>
                <div>
                  <Link to={`/user/${post.author._id}`} className="font-semibold hover:underline">
                    {post.author?.name || 'Unknown'}
                  </Link>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {(userData?.role === 'admin' || userData?._id === post.author?._id) && (
                <button 
                  onClick={() => handleDelete(post._id)}
                  className={`${themes[currentTheme].button} text-sm`}
                >
                  Delete
                </button>
              )}
            </div>
          )}

          <p className="whitespace-pre-line mb-3">{post.content}</p>

          {/* React, Comment, Share options */}
          <div className={`flex items-center justify-between text-sm border-t pt-2 mt-2 ${themes[currentTheme].border}`}>
            <div className="flex gap-4">
              <button className="hover:text-red-500 transition-all">❤️ Like</button>
              <button className="hover:text-blue-500 transition-all">💔 Dislike</button>
              <button className="hover:text-green-500 transition-all">💬 Comment</button>
            </div>
            <button className="hover:text-indigo-500 transition-all">🔗 Share</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;