import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AdminPosts = () => {
  const { backendUrl } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/posts`, {
        withCredentials: true,
      });
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/posts/${postId}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchPosts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">All User Posts</h2>
      
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3">
                <p className="text-gray-800">{post.content}</p>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <span className="font-medium">Author:</span> {post.author?.name || "Unknown"}
                  {post.author?.email && ` (${post.author.email})`}
                </div>
                <div>
                  <span className="font-medium">Posted on:</span>{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPosts;