require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");
const SYSTEM_PROMPT = require("./prompts");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("🤖 PALBOT AI (Gemini) is running...");

bot.on("polling_error", (err) => {
  console.error("Polling Error:", err.message);
});

bot.on("message", async (msg) => {
  if (msg.chat.type === "private") return;
  if (!msg.text) return;
  if (msg.from.is_bot) return;

  try {
    const response = await ai.models.generateContent({
      model: "ggemini-3.6-flash",
      contents: `${SYSTEM_PROMPT}

Pesan anggota grup:
${msg.text}`
    });

    const reply = response.text;

    if (!reply) return;

    await bot.sendMessage(msg.chat.id, reply, {
      reply_to_message_id: msg.message_id,
    });

  } catch (err) {
    console.error("Gemini Error:", err);
  }
});
