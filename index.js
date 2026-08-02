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

console.log("🤖 PALBOT AI is running...");

bot.on("polling_error", (err) => {
  console.error("Polling Error:", err.message);
});

bot.on("message", async (msg) => {
  try {
    // Abaikan chat pribadi
    if (msg.chat.type === "private") return;

    // Abaikan pesan tanpa teks
    if (!msg.text) return;

    // Abaikan bot lain
    if (msg.from.is_bot) return;

    const me = await bot.getMe();

    // Apakah bot di-mention?
    const isMention =
      msg.text.toLowerCase().includes("@" + me.username.toLowerCase());

    // Apakah pesan merupakan reply ke bot?
    const isReply =
      msg.reply_to_message &&
      msg.reply_to_message.from &&
      msg.reply_to_message.from.id === me.id;

    // Jika bukan mention/reply, hanya balas 10% pesan
    if (!isMention && !isReply) {
      if (Math.random() > 0.10) return;
    }

    // Delay acak 15-45 detik
    const delay = Math.floor(Math.random() * 30000) + 15000;

    setTimeout(async () => {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `${SYSTEM_PROMPT}

Nama Pengirim: ${msg.from.first_name}

Pesan:
${msg.text}`,
        });

        const reply = response.text;

        if (!reply) return;

        await bot.sendMessage(msg.chat.id, reply, {
          reply_to_message_id: msg.message_id,
        });
      } catch (err) {
        console.error("Gemini Error:", err);
      }
    }, delay);

  } catch (err) {
    console.error(err);
  }
});
