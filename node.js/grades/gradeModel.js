import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    isNB: { type: Boolean, default: false },
    isON: { type: Boolean, default: false },
}, { timestamps: true });

export const Grade = mongoose.model('Grade', gradeSchema);
