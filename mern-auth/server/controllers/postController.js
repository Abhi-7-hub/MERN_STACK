import Post from "../models/postModel.js";
import userModel from "../models/userModel.js";

// Create Post (user only)
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const author = req.userId;

    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const post = new Post({ content, author });
    await post.save();

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Posts (Admin)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

// Get User Posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Post (User only or Admin)
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const userRole = req.userRole; // middleware userAuth me set

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Admin can delete any post
    if (userRole === "admin" || post.author.toString() === userId) {
      await Post.findByIdAndDelete(postId);
      return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } else {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Post (Admin Only - separate)
export const deletePostAdmin = async (req, res) => {
  try {
    const postId = req.params.postId;

    if (req.userRole !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ success: true, message: "Post deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
