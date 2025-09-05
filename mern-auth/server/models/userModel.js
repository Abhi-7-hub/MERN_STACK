import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // ✅ for future JWT usage

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // OTP verification fields
  verifyOtp: { type: String, default: '' },
  verifyOtpExpireAt: { type: Number, default: 0 },

  isAccountVerified: { type: Boolean, default: false },

  // Password reset fields
  resetOtp: { type: String, default: '' },
  resetOtpExpireAt: { type: Number, default: 0 },

  // User info
  bio: { type: String, default: '' },

  // Role & access control
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

// ✅ Prevent model overwrite error in dev/hot reload
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
