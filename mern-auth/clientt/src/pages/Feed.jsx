import React from 'react';
import Navbar from '../components/Navbar';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

const Feed = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Community Feed</h1>
        <PostForm />
        <PostList />
      </div>
    </div>
  );
};

export default Feed;