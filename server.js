const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const getChatIdsFromUpdates = async () => {
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
  const telegramResponse = await fetch(telegramUrl);
  const data = await telegramResponse.json();

  if (!telegramResponse.ok || !data.ok) {
    throw new Error("Failed to read Telegram updates");
  }

  return Array.from(
    new Set(
      (data.result || [])
        .map((item) => item?.message?.chat?.id || item?.channel_post?.chat?.id)
        .filter(Boolean)
    )
  );
};

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!TELEGRAM_BOT_TOKEN) {
      return res.status(500).json({ error: "Server not configured" });
    }

    let chatId = TELEGRAM_CHAT_ID;
    if (!chatId) {
      const chatIds = await getChatIdsFromUpdates();
      chatId = chatIds[chatIds.length - 1];
    }

    if (!chatId) {
      return res.status(400).json({
        error: "Telegram chat not initialized",
        hint: "Send /start to your bot once, then retry the contact form"
      });
    }

    const text =
      "New portfolio contact message\n\n" +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Message: ${message}\n` +
      `Time: ${new Date().toISOString()}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    if (!telegramResponse.ok) {
      const details = await telegramResponse.text();
      return res.status(502).json({ error: "Telegram send failed", details });
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/telegram-chat-id", async (_req, res) => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return res.status(500).json({ error: "Server not configured" });
    }
    const chatIds = await getChatIdsFromUpdates();

    return res.json({ ok: true, chatIds });
  } catch (_error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
