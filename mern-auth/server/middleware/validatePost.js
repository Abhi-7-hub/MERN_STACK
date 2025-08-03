// middleware/validatePost.js
const validatePost = (req, res, next) => {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Post content cannot be empty" 
      });
    }
    
    next();
  };
  
  export default validatePost;
  
  // Then update postRoutes.js:
  import validatePost from '../middleware/validatePost.js';
  postRouter.post('/', userAuth, validatePost, createPost);