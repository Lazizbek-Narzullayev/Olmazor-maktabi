import express from "express";
import { getAllSubjects, getMySubjects, createSubject, updateSubject, deleteSubject } from "./subjectController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

export const subjectsRouter = express.Router();

// Public - ariza formasi uchun login siz ham ko'rish
subjectsRouter.get('/', getAllSubjects);

// Himoyalangan
subjectsRouter.use(verifyToken);
subjectsRouter.get('/my', allowRoles('teacher', 'admin'), getMySubjects);
subjectsRouter.post('/', allowRoles('teacher', 'admin'), createSubject);
subjectsRouter.patch('/:id', allowRoles('teacher', 'admin'), updateSubject);
subjectsRouter.delete('/:id', allowRoles('teacher', 'admin'), deleteSubject);
