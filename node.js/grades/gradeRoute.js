import express from "express";
import { getStudentGrades, getClassGrades, createGrade, deleteGrade, getAdminStats } from "./gradeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

export const gradesRouter = express.Router();

gradesRouter.use(verifyToken);
gradesRouter.get('/stats', allowRoles('admin'), getAdminStats);
gradesRouter.get('/student/:studentId', getStudentGrades);
gradesRouter.get('/class/:classId', getClassGrades);
gradesRouter.post('/', allowRoles('teacher', 'admin'), createGrade);
gradesRouter.delete('/:id', allowRoles('teacher', 'admin'), deleteGrade);
