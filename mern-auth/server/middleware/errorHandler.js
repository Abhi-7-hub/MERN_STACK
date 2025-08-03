// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something broke!' });
  };
  
  export default errorHandler;
  
  // Then add to server.js:
  import errorHandler from './middleware/errorHandler.js';
  app.use(errorHandler);