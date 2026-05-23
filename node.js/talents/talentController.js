import { Talent } from './talentModel.js';

// ─── Barchasini olish (public) ────────────────────────────────────────────────
export const getTalents = async (req, res) => {
    try {
        const talents = await Talent.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ status: 'success', data: { talents } });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};

// ─── Qo'shish (admin) ─────────────────────────────────────────────────────────
export const createTalent = async (req, res) => {
    try {
        const { name, className, imageUrl, achievement, description, year, order } = req.body;
        if (!name || !className || !achievement) {
            return res.status(400).json({ message: 'Ism, sinf va yutuq majburiy' });
        }
        const talent = await Talent.create({ name, className, imageUrl, achievement, description, year, order });
        res.status(201).json({ status: 'success', data: { talent } });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};

// ─── Yangilash (admin) ────────────────────────────────────────────────────────
export const updateTalent = async (req, res) => {
    try {
        const talent = await Talent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!talent) return res.status(404).json({ message: 'Talaba topilmadi' });
        res.status(200).json({ status: 'success', data: { talent } });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};

// ─── O'chirish (admin) ────────────────────────────────────────────────────────
export const deleteTalent = async (req, res) => {
    try {
        const talent = await Talent.findByIdAndDelete(req.params.id);
        if (!talent) return res.status(404).json({ message: 'Talaba topilmadi' });
        res.status(200).json({ status: 'success', message: "O'chirildi" });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};
