require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Saat bot di-chat secara pribadi
bot.start((ctx) => {
  ctx.reply("👋 Halo! Aku PalBot. Tambahkan aku ke grup untuk mulai membantu percakapan.");
});

// Menyambut anggota baru
bot.on("new_chat_members", (ctx) => {
  ctx.reply("👋 Selamat datang! Semoga betah di Grup Cari Teman Palembang.");
});

// Menjalankan bot
bot.launch();

console.log("✅ PalBot is running...");
