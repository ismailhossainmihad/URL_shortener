import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Link from "./models/Link.js";
import linksRouter from "./routes/links.js";

/*
 * Entry point for the Express server.  It loads environment variables, connects
 * to MongoDB with Mongoose, sets up basic middleware and routes, and
 * configures a redirect endpoint for short links.  When run in development
 * mode (`npm run dev`), it will automatically restart on file changes via
 * `node --watch`.
 */

const app = express();

// Parse JSON bodies on incoming requests
app.use(express.json());

// Allow cross origin requests from specified origins
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true
  })
);

// Simple health check endpoint
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Mount link CRUD routes under /api/links
app.use("/api/links", linksRouter);

// Redirect endpoint: /r/:slug -> original URL
app.get("/r/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const link = await Link.findOne({ slug });
    if (!link) {
      return res.status(404).send("Link not found");
    }
    // Increment click count but don't block redirect if update fails
    Link.updateOne({ _id: link._id }, { $inc: { clicks: 1 } }).catch(() => {});
    return res.redirect(link.target);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// Determine port and database URL from environment
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || "";

// Connect to MongoDB and start listening
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });