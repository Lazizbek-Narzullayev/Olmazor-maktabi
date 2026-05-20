import { Application } from "./applicationModel.js";
import { Users } from "../users/userModel.js";
import { Class } from "../classes/classModel.js";
import bcrypt from "bcryptjs";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

export const createApplication = async (req, res) => {
    try {
        const newApp = await Application.create(req.body);

        const typeLabel = req.body.type === 'maktab' ? '🏫 Maktab qabuli' : '📚 Qo\'shimcha darslar';
        const fanText = req.body.fan ? `\n📖 <b>Fan:</b> ${req.body.fan}` : '';
        const dateStr = new Date().toLocaleString('ru-RU');

        const message = `📋 <b>YANGI ARIZA</b>\n━━━━━━━━━━━━━━━━━\n🎯 <b>Tur:</b> ${typeLabel}\n👤 <b>Ism Familiya:</b> ${req.body.ism} ${req.body.familiya}\n📞 <b>Telefon:</b> ${req.body.telefon}\n🏫 <b>Sinf:</b> ${req.body.sinf}${fanText}\n📅 <b>Vaqt:</b> ${dateStr}\n━━━━━━━━━━━━━━━━━\n⏳ <b>Status:</b> Kutilmoqda`;

        await bot.sendMessage(CHANNEL_ID, message, { parse_mode: 'HTML' });

        res.status(201).json({ status: 'created', data: { application: newApp } });
    } catch (err) {
        console.error('Xatolik:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: { applications } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);
        
        if (!application) return res.status(404).json({ status: 'error', message: 'Ariza topilmadi' });

        if (status === 'qabul_qilindi' && application.status !== 'qabul_qilindi') {
            const sinfName = application.sinf;
            let targetClass = await Class.findOne({ name: { $regex: new RegExp(`^${sinfName}`, 'i') } });
            
            const baseUserName = `${application.ism.toLowerCase()}_${application.familiya.toLowerCase()}`.replace(/[^a-z0-9_]/g, '');
            let userName = baseUserName;
            let counter = 1;
            while (await Users.findOne({ userName })) {
                userName = `${baseUserName}${counter}`;
                counter++;
            }

            const plainPassword = 'password123';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            
            await Users.create({
                name: `${application.ism} ${application.familiya}`,
                userName: userName,
                password: hashedPassword,
                plainPassword: plainPassword,
                phoneNumber: application.telefon,
                role: 'student',
                classId: targetClass ? targetClass._id : null,
                isFirstLogin: true
            });
        }

        const updated = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json({ status: 'success', data: { application: updated } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Ariza o\'chirildi' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
