import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: { type: String, default: '' },
    author:      { type: String, default: '' },
    fileUrl:     { type: String, required: true },
    fileId:      { type: String },
    uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    // 'general'  → Umumiy kutubxona (admin yuklaydi, barcha ko'radi)
    // 'teacher'  → Ustozlar kutubxonasi (o'qituvchi yuklaydi)
    type:        { type: String, enum: ['general', 'teacher'], default: 'general' },
    category:    { type: String, default: 'Boshqa' },
    downloads:   { type: Number, default: 0 },
}, { timestamps: true });

export const Library = mongoose.model('Library', librarySchema);
