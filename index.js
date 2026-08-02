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

bot.on("polling_error", (err) => {
  console.error("Polling Error:", err.message);
});

bot.on("message", async (msg) => {
  // Hanya grup
  if (msg.chat.type === "private") return;

  // Hanya pesan teks
  if (!msg.text) return;

  // Abaikan pesan dari bot lain
  if (msg.from.is_bot) return;

  // Untuk pengujian: balas semua pesan.
  // Nanti kita ubah menjadi 15% agar tidak spam.
  try {
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
      temperature: 0.8,
      max_tokens: 150,
    });

    const reply = response.choices[0].message.content;

    await bot.sendMessage(msg.chat.id, reply, {
      reply_to_message_id: msg.message_id,
    });
  } catch (err) {
    console.error("OpenAI Error:", err);

    await bot.sendMessage(
      msg.chat.id,
      "Maaf, aku sedang mengalami kendala. Coba lagi sebentar ya."
    );
  }
});
