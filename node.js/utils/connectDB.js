import mongoose from "mongoose"
import dotenv from "dotenv"
import dns from "dns"
import bcrypt from "bcryptjs"
import { Users } from "../users/userModel.js"
dotenv.config()

export const connectDB = async () => {
    try {
        dns.setServers(["8.8.8.8", "8.8.4.4"])
        const uri = process.env.MONGO_URI
        await mongoose.connect(uri)
        console.log("✅ MongoDB ga muvaffaqiyatli ulandi!")

        // Avtomatik admin yaratish
        const adminExists = await Users.findOne({ role: 'admin' })
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10)
            await Users.create({
                userName: 'admin',
                password: hashedPassword,
                plainPassword: 'admin123',
                name: 'Maktab Admini',
                role: 'admin',
                isFirstLogin: false
            })
            console.log("🎉 Standart admin foydalanuvchisi yaratildi (login: admin, parol: admin123)")
        } else {
            console.log("ℹ️ Admin foydalanuvchisi allaqachon mavjud.")
        }
    } catch (error) {
        console.error('❌ MongoDB ulanish xatoligi:', error.message);
        process.exit(1)
    }
}