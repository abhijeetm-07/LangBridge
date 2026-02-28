import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDb } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); // Resolves to the project root on Render

app.use(express.json());
app.use(cookieParser());

// In production, the frontend is served from the same domain,
// so we only need CORS for local development.
const allowedOrigins = [
  "http://localhost:5173",
  "https://langbridge-1.onrender.com", // Replace with your actual Render URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      // or if the origin is in our allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Static file serving for Production
if (process.env.NODE_ENV === "production") {
  // Serve the frontend build folder located at the root
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  // Handle SPA routing: all other routes serve the frontend's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
