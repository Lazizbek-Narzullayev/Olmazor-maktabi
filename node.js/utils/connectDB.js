import mongoose from "mongoose"
import dotenv from "dotenv"
import dns from "dns"
dotenv.config()

export const connectDB = async () => {
    try {
        dns.setServers(["8.8.8.8", "8.8.4.4"])
        const uri = process.env.MONGO_URI
        await mongoose.connect(uri)
        console.log("✅ MongoDB ga muvaffaqiyatli ulandi!")
    } catch (error) {
        console.error('❌ MongoDB ulanish xatoligi:', error.message);
        process.exit(1)
    }
}