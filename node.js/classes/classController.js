import { Class } from "./classModel.js";
import { Users } from "../users/userModel.js";

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('teacherId', 'name userName');
        const classesWithStudents = await Promise.all(classes.map(async (cls) => {
            const students = await Users.find({ classId: cls._id, role: 'student' }).select('name userName phoneNumber');
            return { ...cls.toObject(), studentIds: students };
        }));
        res.status(200).json({ status: 'success', data: { classes: classesWithStudents } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getPublicClasses = async (req, res) => {
    try {
        const classes = await Class.find().select('_id name').sort({ name: 1 });
        res.status(200).json({ status: 'success', data: { classes } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getClassById = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id).populate('teacherId', 'name userName');
        if (!cls) return res.status(404).json({ status: 'error', message: 'Sinf topilmadi' });
        const students = await Users.find({ classId: cls._id, role: 'student' }).select('name userName phoneNumber');
        res.status(200).json({ status: 'success', data: { class: { ...cls.toObject(), studentIds: students } } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getTeacherClasses = async (req, res) => {
    try {
        const classes = await Class.find({ teacherId: req.params.teacherId });
        const classesWithStudents = await Promise.all(classes.map(async (cls) => {
            const students = await Users.find({ classId: cls._id, role: 'student' }).select('name userName phoneNumber');
            return { ...cls.toObject(), studentIds: students };
        }));
        res.status(200).json({ status: 'success', data: { classes: classesWithStudents } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const createClass = async (req, res) => {
    try {
        const newClass = await Class.create(req.body);
        res.status(201).json({ status: 'created', data: { class: newClass } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const updateClass = async (req, res) => {
    try {
        const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: 'success', data: { class: updated } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const deleteClass = async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Sinf o\'chirildi' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
