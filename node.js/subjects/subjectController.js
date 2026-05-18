import { Subject } from "./subjectModel.js";

export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('teacherId', 'name');
        res.status(200).json({ status: 'success', data: { subjects } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getMySubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ teacherId: req.user.id });
        res.status(200).json({ status: 'success', data: { subjects } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const createSubject = async (req, res) => {
    try {
        const newSubject = await Subject.create({ ...req.body, teacherId: req.user.id });
        res.status(201).json({ status: 'created', data: { subject: newSubject } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: 'success', data: { subject: updated } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Fan o\'chirildi' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
