import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Users } from "../users/userModel.js";
dotenv.config();

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await Users.findOne({ userName });
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Foydalanuvchi topilmadi' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Parol noto\'g\'ri' });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, userName: user.userName },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                userName: user.userName,
                name: user.name,
                role: user.role,
                isFirstLogin: user.isFirstLogin,
                classId: user.classId,
                image: user.image,
                specialization: user.specialization,
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await Users.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'Foydalanuvchi topilmadi' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Eski parol noto\'g\'ri' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.plainPassword = newPassword; // Update plain password
        user.isFirstLogin = false;
        await user.save();
        res.status(200).json({ status: 'success', message: 'Parol muvaffaqiyatli o\'zgartirildi' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ status: 'error', message: 'Foydalanuvchi topilmadi' });
        res.status(200).json({ status: 'success', data: { user: {
            id: user._id,
            userName: user.userName,
            name: user.name,
            role: user.role,
            classId: user.classId,
            joinedDate: user.joinedDate,
            graduatedTalentsCount: user.graduatedTalentsCount,
            olympiads: user.olympiads,
            image: user.image,
            specialization: user.specialization
        } } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
