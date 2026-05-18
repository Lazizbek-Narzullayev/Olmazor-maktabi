import bcrypt from "bcryptjs";
import { Users } from "./userModel.js";

export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const users = await Users.find({ role })
            .select('name image specialization olympiads role')
            .populate('classId', 'name');
        res.status(200).json({ status: 'success', data: { users } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find()
            .populate('classId', 'name')
            .populate('subjectIds', 'name');
        res.status(200).json({ status: 'success', data: { users } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
            .select('-password')
            .populate('classId')
            .populate('subjectIds');
        if (!user) return res.status(404).json({ status: 'error', message: 'Topilmadi' });
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { userName, password, name, role, classId, subjectIds, phoneNumber, olympiads, specialization } = req.body;
        
        // Handle file upload
        let image = '';
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        const hashed = await bcrypt.hash(password, 10);
        
        const createData = {
            userName, 
            password: hashed, 
            plainPassword: password,
            name, role, 
            classId: classId || null, 
            phoneNumber,
            image,
            specialization,
            isFirstLogin: true,
        };

        // Parse arrays if they come as strings (common with FormData)
        if (subjectIds) {
            createData.subjectIds = typeof subjectIds === 'string' ? subjectIds.split(',').filter(s => s) : subjectIds;
        }
        if (olympiads) {
            createData.olympiads = typeof olympiads === 'string' ? olympiads.split(',').filter(s => s) : olympiads;
        }

        const newUser = await Users.create(createData);
        
        const safeUser = newUser.toObject();
        delete safeUser.password;
        res.status(201).json({ status: 'created', data: { user: safeUser } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { password, subjectIds, olympiads, specialization, classId, ...rest } = req.body;
        let updateData = { ...rest };

        if (classId !== undefined) {
            updateData.classId = classId || null;
        }
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
            updateData.plainPassword = password;
        }

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        if (specialization !== undefined) {
            updateData.specialization = specialization;
        }

        // Parse arrays if they come as strings
        if (subjectIds !== undefined) {
            updateData.subjectIds = typeof subjectIds === 'string' ? subjectIds.split(',').filter(s => s) : subjectIds;
        }
        if (olympiads !== undefined) {
            updateData.olympiads = typeof olympiads === 'string' ? olympiads.split(',').filter(s => s) : olympiads;
        }

        const updated = await Users.findByIdAndUpdate(
            req.params.id, updateData, { new: true }
        ).select('-password');
        res.status(200).json({ status: 'success', data: { user: updated } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getPublicTeachers = async (req, res) => {
    try {
        const users = await Users.find({ role: 'teacher' })
            .select('name image specialization olympiads role');
        res.status(200).json({ status: 'success', data: { users } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Foydalanuvchi o\'chirildi' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};