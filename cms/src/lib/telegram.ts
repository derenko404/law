/**
 * Sends a notification to the lawyer's Telegram chat via the Bot API.
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID env vars; silently
 * no-ops (with a log) when they are missing so lead creation never fails
 * because of Telegram.
 */
export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('Telegram notification skipped: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set')
    return
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  })

  if (!res.ok) {
    console.error('Telegram sendMessage failed:', res.status, await res.text())
  }
}
