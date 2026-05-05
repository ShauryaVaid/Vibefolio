const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

// API Routes
app.post("/api/contact", async (req, res) => { /* ... your existing logic ... */ });
app.get("/api/telegram-chat-id", async (req, res) => { /* ... your existing logic ... */ });

// On Vercel, the "public" folder is served automatically if configured.
// But for safety in your Express routes:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
