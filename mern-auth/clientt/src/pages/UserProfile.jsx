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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">{profileUser.name}</h1>
          <p className={`text-sm ${profileUser.isAccountVerified ? 'text-green-600' : 'text-yellow-600'}`}>
            {profileUser.isAccountVerified ? 'Verified Account' : 'Unverified Account'}
          </p>
        </div>

        {userData?._id === userId && <PostForm />}
        
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {userData?._id === userId ? 'Your Posts' : `${profileUser.name}'s Posts`}
        </h2>
        <PostList userId={userId} showAuthor={false} />
      </div>
    </div>
  );
};

export default UserProfile;