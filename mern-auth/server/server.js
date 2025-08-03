// server.js or index.js

import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authroutes.js';
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5175',
  'http://localhost:5176',
  'https://moonlit-monstera-9b97dc.netlify.app' // ✅ Netlify deployed frontend
];

// ✅ CORS config
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // ✅ Required for cookies
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Health check route
app.get('/', (req, res) => res.send("API Working Fine"));

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
