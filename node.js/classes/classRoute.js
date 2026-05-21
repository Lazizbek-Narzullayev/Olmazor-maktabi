import express from "express";
import { getAllClasses, getClassById, createClass, updateClass, deleteClass, getTeacherClasses, getPublicClasses } from "./classController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

export const classesRouter = express.Router();

classesRouter.get('/public', getPublicClasses);
classesRouter.use(verifyToken);
classesRouter.get('/', getAllClasses);
classesRouter.get('/teacher/:teacherId', getTeacherClasses);
classesRouter.get('/:id', getClassById);
classesRouter.post('/', allowRoles('admin'), createClass);
classesRouter.patch('/:id', allowRoles('admin'), updateClass);
classesRouter.delete('/:id', allowRoles('admin'), deleteClass);
