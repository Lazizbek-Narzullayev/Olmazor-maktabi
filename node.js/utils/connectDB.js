import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI
        await mongoose.connect(uri)
        console.log("✅ MongoDB ga muvaffaqiyatli ulandi!")
    } catch (error) {
        console.error('❌ MongoDB ulanish xatoligi:', error.message);
        process.exit(1)
    }
}