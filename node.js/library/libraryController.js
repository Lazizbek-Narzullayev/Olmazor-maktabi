import { Library } from './libraryModel.js';
import fs from 'fs';
import path from 'path';

export const uploadFile = async (req, res) => {
    try {
        console.log('Upload Request - Body:', req.body);
        console.log('Upload Request - File:', req.file);

        if (!req.file) {
            console.error('No file received');
            return res.status(400).json({ message: 'Fayl yuklanmadi' });
        }

        const { title, description, category, teacherId } = req.body;

        // Save local path for the fileUrl (accessible via /uploads static route)
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const newFile = await Library.create({
            title: title || 'Noma\'lum',
            description: description || '',
            category: category || 'Umumiy',
            teacherId: teacherId, 
            fileUrl: fileUrl,
            fileId: req.file.filename,
        });

        console.log('New file created in DB:', newFile);
        res.status(201).json({ status: 'success', data: { file: newFile } });
    } catch (e) {
        console.error('SERVER UPLOAD ERROR:', e);
        res.status(500).json({ status: 'error', message: e.message });
    }
};

export const getFiles = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};
        if (category) filter.category = category;

        const files = await Library.find(filter).populate('teacherId', 'name');
        console.log(`Fetched ${files.length} files from library`);
        res.status(200).json({ status: 'success', data: { files } });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const file = await Library.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'Fayl topilmadi' });

        // Delete from local disk
        const filePath = path.join('uploads', file.fileId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Library.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Fayl o\'chirildi' });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
};
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
