const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());

// Your Telegram logic remains exactly the same
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// API Route for Contact Form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // ... (Keep your existing Telegram fetch logic here)
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// IMPORTANT: For Vercel, we export the app instead of calling app.listen()
module.exports = app;
