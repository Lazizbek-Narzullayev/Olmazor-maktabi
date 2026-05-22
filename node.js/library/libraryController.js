import { Library } from './libraryModel.js';
import fs from 'fs';
import path from 'path';

// ─── Upload (admin ham, o'qituvchi ham ishlatishi mumkin) ─────────────────────
export const uploadFile = async (req, res) => {
    try {
        // If a URL is provided, use it directly; otherwise expect a file upload
        const { title, description, author, category, type, uploadedBy, url } = req.body;
        let fileUrl = '';
        let fileId = '';
        if (url) {
            fileUrl = url;
        } else {
            if (!req.file) {
                return res.status(400).json({ message: 'Fayl yuklanmadi' });
            }
            fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            fileId = req.file.filename;
        }

        const newFile = await Library.create({
            title: title || 'Nomsiz kitob',
            description: description || '',
            author: author || '',
            category: category || 'Boshqa',
            type: type || 'general',
            uploadedBy: uploadedBy || null,
            fileUrl,
            fileId,
        });

        const populated = await Library.findById(newFile._id).populate('uploadedBy', 'name role specialization');
        res.status(201).json({ status: 'success', data: { file: populated } });
    } catch (e) {
        console.error('UPLOAD ERROR:', e);
        res.status(500).json({ status: 'error', message: e.message });
    }
};

// ─── Barcha kitoblarni olish (type bo'yicha filter) ──────────────────────────
export const getFiles = async (req, res) => {
    try {
        const { type, category } = req.query;
        const filter = {};
        if (type)     filter.type     = type;
        if (category) filter.category = category;

        const files = await Library.find(filter)
            .populate('uploadedBy', 'name role specialization')
            .sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', data: { files } });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};

// ─── Faylni o'chirish ─────────────────────────────────────────────────────────
export const deleteFile = async (req, res) => {
    try {
        const file = await Library.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'Fayl topilmadi' });

        // Diskdan o'chirish
        if (file.fileId) {
            const filePath = path.join('uploads', file.fileId);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Library.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: "Fayl o'chirildi" });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};

// ─── Yuklab olishlar sonini oshirish ─────────────────────────────────────────
export const trackDownload = async (req, res) => {
    try {
        const file = await Library.findByIdAndUpdate(
            req.params.id,
            { $inc: { downloads: 1 } },
            { new: true }
        );
        if (!file) return res.status(404).json({ status: 'error', message: 'Fayl topilmadi' });
        res.status(200).json({ status: 'success', data: { file } });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};
