import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    fileId: { type: String }, // Optional for local storage (filename)
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    category: { type: String, default: 'Umumiy' },
    downloads: { type: Number, default: 0 },
}, { timestamps: true });

export const Library = mongoose.model('Library', librarySchema);
