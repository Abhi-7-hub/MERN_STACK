// routes/postRoutes.js
import express from 'express';
import { 
  createPost, 
  getAllPosts, 
  getUserPosts, 
  deletePost 
} from '../controllers/postController.js';
import userAuth from '../middleware/userAuth.js';

const postRouter = express.Router();

// Protected routes
postRouter.post('/', userAuth, createPost);
postRouter.delete('/:id', userAuth, deletePost);

// Public routes
postRouter.get('/', getAllPosts);
postRouter.get('/user/:id', getUserPosts);

export default postRouter;