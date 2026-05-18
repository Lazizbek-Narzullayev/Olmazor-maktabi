/**
 * Birinchi admin foydalanuvchini yaratish scripti
 * Faqat bir marta ishlatiladi!
 *
 * Ishlatish: node createAdmin.js
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
    isFirstLogin: { type: Boolean, default: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
    subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    phoneNumber: { type: String },
}, { timestamps: true });

const Users = mongoose.model('Users', userSchema);

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB ga ulandi');

        // Admin mavjudligini tekshirish
        const existing = await Users.findOne({ role: 'admin' });
        if (existing) {
            console.log('⚠️  Admin allaqachon mavjud:', existing.userName);
            process.exit(0);
        }

        // Admin yaratish
        const hashed = await bcrypt.hash('admin123', 10);
        const admin = await Users.create({
            userName: 'admin',
            password: hashed,
            name: 'Maktab Admini',
            role: 'admin',
            isFirstLogin: false,  // Admin uchun birinchi kirish o'zgarishi kerak emas
        });

        console.log('🎉 Admin muvaffaqiyatli yaratildi!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👤 Login:  admin');
        console.log('🔑 Parol:  admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Login qilgandan keyin parolni o\'zgartiring!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Xatolik tafsilotlari:', err);
        process.exit(1);
    }
};

createAdmin();
