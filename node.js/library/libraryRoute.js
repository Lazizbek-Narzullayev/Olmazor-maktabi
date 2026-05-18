import express from 'express';
import { uploadFile, getFiles, deleteFile, trackDownload } from './libraryController.js';
import { localUpload } from '../utils/localUpload.js';

const router = express.Router();

// O'qituvchilar fayl yuklashi uchun
router.post('/upload', localUpload.single('file'), uploadFile);

// Barcha uchun fayllarni ko'rish (chorak yoki kategoriya bo'yicha filter bilan)
router.get('/', getFiles);

// Faylni o'chirish (o'qituvchi o'zi yuklaganini o'chirishi uchun)
router.delete('/:id', deleteFile);

// Yuklab olishlarni sanash
router.patch('/:id/download', trackDownload);

export default router;
