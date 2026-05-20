import { Grade } from "./gradeModel.js";

export const getAllGrades = async (req, res) => {
    try {
        const grades = await Grade.find()
            .populate('studentId', 'name')
            .populate('subjectId', 'name')
            .populate('teacherId', 'name')
            .sort({ date: -1 });
        res.status(200).json({ status: 'success', data: { grades } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getStudentGrades = async (req, res) => {
    try {
        const grades = await Grade.find({ studentId: req.params.studentId })
            .populate('subjectId', 'name')
            .populate('teacherId', 'name')
            .sort({ date: -1 });
        res.status(200).json({ status: 'success', data: { grades } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getClassGrades = async (req, res) => {
    try {
        const grades = await Grade.find({ classId: req.params.classId })
            .populate('studentId', 'name')
            .populate('subjectId', 'name')
            .populate('teacherId', 'name')
            .sort({ date: -1 });
        res.status(200).json({ status: 'success', data: { grades } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const createGrade = async (req, res) => {
    try {
        const newGrade = await Grade.create({ ...req.body, teacherId: req.user.id });
        const populated = await Grade.findById(newGrade._id)
            .populate('studentId', 'name')
            .populate('subjectId', 'name');
        res.status(201).json({ status: 'created', data: { grade: populated } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const deleteGrade = async (req, res) => {
    try {
        await Grade.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Baho o\'chirildi' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const grades = await Grade.find();
        const avg = grades.length
            ? (grades.reduce((s, g) => s + g.score, 0) / grades.length).toFixed(2)
            : 0;
        res.status(200).json({ status: 'success', data: { total: grades.length, average: avg } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
