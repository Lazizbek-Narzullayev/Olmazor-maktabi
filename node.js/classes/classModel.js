import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "5A", "6B"
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: null },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    subjects: [{
        name: String,
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
    }],
    year: { type: String, default: '2024-2025' },
}, { timestamps: true });

export const Class = mongoose.model('Class', classSchema);
