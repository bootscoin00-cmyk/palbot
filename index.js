console.log("🤖 PALBOT STARTED");

bot.on("polling_error", (err) => {
  console.log("Polling Error:", err);
});

bot.on("message", (msg) => {
  console.log("MESSAGE RECEIVED:", msg.text);
});
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const OpenAI = require("openai");
const SYSTEM_PROMPT = require("./prompts");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🤖 PALBOT AI is running...");

bot.on("message", async (msg) => {
  // Hanya grup
  if (msg.chat.type === "private") return;

  // Abaikan jika bukan teks
  if (!msg.text) return;

  // Abaikan bot lain
  if (msg.from.is_bot) return;

  // Peluang membalas 15%
  if (Math.random() > 0.15) return;

  try {
    // Delay acak 20-60 detik
    const delay = Math.floor(Math.random() * 40000) + 20000;

    setTimeout(async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: msg.text,
          },
        ],
        temperature: 0.9,
        max_tokens: 120,
      });

      const reply = response.choices[0].message.content;

      await bot.sendMessage(msg.chat.id, reply, {
        reply_to_message_id: msg.message_id,
      });
    }, delay);
  } catch (err) {
    console.error(err);
  }
});
