import mongoose from 'mongoose';

const talentSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    className:   { type: String, required: true },  // e.g. "9-B"
    imageUrl:    { type: String, default: '' },      // URL to student photo
    achievement: { type: String, required: true },   // e.g. "IELTS 7.0", "Matematika olimpiadasi 1-o'rin"
    description: { type: String, default: '' },      // optional extra info
    year:        { type: String, default: () => new Date().getFullYear().toString() },
    order:       { type: Number, default: 0 },       // display order
}, { timestamps: true });

export const Talent = mongoose.model('Talent', talentSchema);
