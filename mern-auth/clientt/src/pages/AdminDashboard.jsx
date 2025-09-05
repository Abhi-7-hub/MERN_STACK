import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    blockedUsers: 0
  });

  // ✅ Only admin can access
  useEffect(() => {
    if (userData?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [userData]);

  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchData();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/stats`, { withCredentials: true });
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const { data } = await axios.get(`${backendUrl}/api/admin/users`, { withCredentials: true });
        if (data.success) setUsers(data.users);
      } else if (activeTab === 'posts') {
        const { data } = await axios.get(`${backendUrl}/api/admin/posts`, { withCredentials: true });
        if (data.success) setPosts(data.posts);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (userId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/users/${userId}/toggle-block`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        setUsers(users.map(user =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        ));
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/posts/${postId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Post deleted successfully');
        setPosts(posts.filter(post => post._id !== postId));
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (userData?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">You need admin privileges to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ✅ Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Manage users and posts in your platform</p>
        </div>

        {/* ✅ Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: 'Total Users', value: stats.totalUsers, color: 'indigo' },
            { title: 'Total Posts', value: stats.totalPosts, color: 'emerald' },
            { title: 'Blocked Users', value: stats.blockedUsers, color: 'rose' }
          ].map((item, idx) => (
            <div key={idx} className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 p-6`}>
              <div className="flex items-center">
                <div className={`p-4 rounded-full bg-${item.color}-100 text-${item.color}-600`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-3xl font-bold">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['users', 'posts'].map(tab => (
                <button
                  key={tab}
                  className={`flex-1 py-4 text-center border-b-2 font-medium text-sm transition ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ✅ Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['User', 'Email', 'Status', 'Joined', 'Actions'].map((h, i) => (
                      <th key={i} className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found</td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="ml-3 font-medium text-gray-900">{user.name || 'Unknown'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${user.isBlocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleBlockUser(user._id)}
                            className={`mr-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition ${
                              user.isBlocked
                                ? 'bg-emerald-500 hover:bg-emerald-600'
                                : 'bg-rose-500 hover:bg-rose-600'
                            }`}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No posts found</div>
            ) : (
              posts.map(post => (
                <div key={post._id} className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{post.author?.name || 'Unknown User'}</p>
                        <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="text-rose-500 hover:text-rose-700 p-2 rounded-full hover:bg-rose-50 transition"
                      title="Delete post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="whitespace-pre-line text-gray-800">{post.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
