import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";

// ---------------- Admin Register ----------------
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await userModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    res.status(201).json({ success: true, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- Admin Login ----------------
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await userModel.findOne({ email, role: "admin" });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.json({
      success: true,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get All Users ----------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: "user" }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Toggle Block User ----------------
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ success: true, message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get All Posts ----------------
export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().populate("author", "name email").sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Delete Post ----------------
export const deletePostAdmin = async (req, res) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Dashboard Stats ----------------
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments({ role: "user" });
    const totalPosts = await postModel.countDocuments();
    const blockedUsers = await userModel.countDocuments({ isBlocked: true });

    res.json({
      success: true,
      stats: { totalUsers, totalPosts, blockedUsers }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
