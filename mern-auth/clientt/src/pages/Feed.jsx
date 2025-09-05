import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

const Feed = () => {
  const { isLoggedin, authChecked } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && !isLoggedin) {
      navigate('/');
    }
  }, [isLoggedin, authChecked, navigate]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center relative">
      <div className="bg-black bg-opacity-40 min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto py-8 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            Community Feed
          </h1>
          <PostForm />
          <PostList />
        </div>
      </div>
    </div>
  );
};

export default Feed;
