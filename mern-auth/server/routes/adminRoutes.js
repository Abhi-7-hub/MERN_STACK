import express from "express";
import { adminAuth } from "../middleware/userAuth.js";
import { 
  registerAdmin, 
  loginAdmin, 
  getAllUsers, 
  toggleBlockUser, 
  getAllPosts, 
  deletePostAdmin, 
  getDashboardStats 
} from "../controllers/adminController.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected admin routes
router.use(adminAuth);

router.get("/users", getAllUsers);
router.patch("/users/:userId/toggle-block", toggleBlockUser);

router.get("/posts", getAllPosts);
router.delete("/posts/:postId", deletePostAdmin);

router.get("/stats", getDashboardStats);

export default router;
