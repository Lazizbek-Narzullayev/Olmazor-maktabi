import { Schedule } from "./scheduleModel.js";

export const getTeacherSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find({ teacherId: req.params.teacherId })
            .populate('classId', 'name');
        res.status(200).json({ status: 'success', data: { schedule } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getClassSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find({ classId: req.params.classId })
            .populate('teacherId', 'name');
        res.status(200).json({ status: 'success', data: { schedule } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const getAllSchedules = async (req, res) => {
    try {
        const schedule = await Schedule.find()
            .populate('classId', 'name')
            .populate('teacherId', 'name');
        res.status(200).json({ status: 'success', data: { schedule } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const createSchedule = async (req, res) => {
    try {
        const newSchedule = await Schedule.create(req.body);
        const populated = await Schedule.findById(newSchedule._id)
            .populate('classId', 'name').populate('teacherId', 'name');
        res.status(201).json({ status: 'created', data: { schedule: populated } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Jadval o\'chirildi' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
