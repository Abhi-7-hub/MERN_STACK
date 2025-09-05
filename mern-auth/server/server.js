// server.js

import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authroutes.js';
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:5173',                  // local dev frontend
  'http://localhost:5175',
  'http://localhost:5176',
  'https://moonlit-monstera-9b97dc.netlify.app', // deployed frontend
  'https://mern-stack-i5g2.onrender.com'         // deployed backend/frontend domain
  
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // ✅ allows cookies to be sent
}));

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());

// ✅ Health Check
app.get('/', (req, res) => res.send("API Working Fine"));

// ✅ API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/admin', adminRouter);






// ✅ Error handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
