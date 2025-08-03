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
connectDB();

// ✅ Allow both 5173 (main frontend) and 5175 (Postman/test frontend)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5175'];

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ API Endpoints
app.get('/', (req, res) => res.send("API Working Fine"));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
