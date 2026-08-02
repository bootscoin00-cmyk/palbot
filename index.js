require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Halo! Aku PalBot.\n\nTambahkan aku ke grup agar aku bisa membantu percakapan."
  );
});

bot.on("new_chat_members", (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Selamat datang di Grup Cari Teman Palembang! Semoga betah 😊"
  );
});

console.log("✅ PalBot is running...");
