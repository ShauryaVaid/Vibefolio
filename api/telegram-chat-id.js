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

module.exports = async (_req, res) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ error: "Server not configured" });
    }

    const chatIds = await getChatIdsFromUpdates(botToken);
    return res.status(200).json({ ok: true, chatIds });
  } catch (_error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
