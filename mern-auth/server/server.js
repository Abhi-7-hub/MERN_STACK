// server.js

import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authroutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed origins (only frontends, not backend itself)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://moonlit-monstera-9b97dc.netlify.app" // deployed frontend
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".netlify.app")
      ) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ allow cookies
  })
);

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());

// ✅ Health Check
app.get("/", (req, res) => res.send("API Working Fine"));

// ✅ Debug endpoint
app.get("/api/debug", (req, res) => {
  res.json({
    success: true,
    message: "Debug working",
    routes: ["/api/auth", "/api/user", "/api/posts", "/api/admin"],
  });
});

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/admin", adminRouter);

// ✅ Error handler (send original error for debugging)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Something went wrong!" });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
