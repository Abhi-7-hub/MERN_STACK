// src/components/PostList.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const PostList = ({ userId, showAuthor = true }) => {
  const { backendUrl, userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const endpoint = userId 
        ? `${backendUrl}/api/posts/user/${userId}`
        : `${backendUrl}/api/posts`;
      
      const { data } = await axios.get(endpoint);
      if (data.success) {
        setPosts(data.posts || []); // Ensure posts is always an array
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch posts');
      setPosts([]); // Set empty array on error
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
      const { data } = await axios.delete(`${backendUrl}/api/posts/${postId}`);
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
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post._id} className="bg-white rounded-lg shadow-md p-4">
          {showAuthor && post.author && (
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Link 
                  to={`/user/${post.author._id}`} 
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold"
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
              {userData?._id === post.author?._id && (
                <button 
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          )}
          <p className="whitespace-pre-line text-gray-800">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;