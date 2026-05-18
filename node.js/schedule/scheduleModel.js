import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    subjectName: { type: String, required: true },
    dayOfWeek: {
        type: String,
        required: true,
        enum: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, default: '' },
    quarter: { type: Number, default: 1, min: 1, max: 4 },
}, { timestamps: true });

export const Schedule = mongoose.model('Schedule', scheduleSchema);
