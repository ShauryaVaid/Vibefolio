const getChatIdsFromUpdates = async (botToken) => {
  const telegramUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;
  const response = await fetch(telegramUrl);
  const data = await response.json();

  if (!response.ok || !data.ok) {
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

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    let chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken) {
      return res.status(500).json({ error: "Server not configured" });
    }

    if (!chatId) {
      const chatIds = await getChatIdsFromUpdates(botToken);
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

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
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

    return res.status(200).json({ ok: true });
  } catch (_error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
