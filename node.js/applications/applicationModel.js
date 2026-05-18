import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    type: { type: String, enum: ['maktab', 'qoshimcha'], required: true },
    ism: { type: String, required: true },
    familiya: { type: String, required: true },
    telefon: { type: String, required: true },
    sinf: { type: String, required: true },
    fan: { type: String, default: '' },
    status: {
        type: String,
        enum: ['kutilmoqda', 'qabul_qilindi', 'rad_etildi'],
        default: 'kutilmoqda'
    },
}, { timestamps: true });

export const Application = mongoose.model('Application', applicationSchema);
