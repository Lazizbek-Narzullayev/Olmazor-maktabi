import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHANNEL_ID;

console.log("Token:", token);
console.log("Chat ID:", chatId);

const bot = new TelegramBot(token, { polling: false });

async function testSendMessage() {
    try {
        console.log("Xabar yuborilmoqda...");
        const result = await bot.sendMessage(chatId, "🚀 Test xabari: Olmazor Maktab tizimidan xabar!");
        console.log("✅ Xabar muvaffaqiyatli yuborildi!");
        console.log("Result details:", result.chat.id, result.chat.title);
    } catch (error) {
        console.error("❌ Xatolik yuz berdi:");
        console.error("Error Code:", error.code);
        console.error("Error Description:", error.response ? error.response.body.description : error.message);
        
        if (error.response && error.response.body.error_code === 400) {
            console.log("\n💡 Maslahat: Bot kanalda administrator ekanligini va xabar yuborish huquqi borligini tekshiring.");
            console.log("Yoki CHANNEL_ID noto'g'ri bo'lishi mumkin.");
        }
    }
}

testSendMessage();
