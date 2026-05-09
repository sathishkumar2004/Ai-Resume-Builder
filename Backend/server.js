require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const aiRouter = require("./routes/aiRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-resume-builder-6kuztf7f4-sathishkumar.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // Allow any origin in the allowedOrigins array
    // Allow any Vercel preview or production domain
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// Add connection event listeners for better debugging
mongoose.connection.on("connecting", () => console.log("⏳ Connecting to MongoDB..."));
mongoose.connection.on("connected", () => console.log("✅ MongoDB Connection Established"));
mongoose.connection.on("error", (err) => console.error(`❌ MongoDB Connection Error: ${err.message}`));
mongoose.connection.on("disconnected", () => console.log("🔌 MongoDB Disconnected"));

const connectDB = async () => {
  try {
    console.log("🔍 Checking MONGO_URI configuration...");
    if (!MONGO_URI) {
      console.error("❌ ERROR: MONGO_URI or MONGODB_URI is not defined in environment variables.");
      return; // Don't exit yet, let the server start so we can see this log
    }

    console.log("📡 Attempting to connect to MongoDB Atlas...");
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Optional: process.exit(1); 
    // On Render, exiting might cause a loop. Better to log and let it stay up for debugging.
  }
};

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});