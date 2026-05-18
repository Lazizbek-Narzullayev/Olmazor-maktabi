import express from "express";
import { getTeacherSchedule, getClassSchedule, getAllSchedules, createSchedule, deleteSchedule } from "./scheduleController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

export const scheduleRouter = express.Router();

scheduleRouter.use(verifyToken);
scheduleRouter.get('/', allowRoles('admin'), getAllSchedules);
scheduleRouter.get('/teacher/:teacherId', getTeacherSchedule);
scheduleRouter.get('/class/:classId', getClassSchedule);
scheduleRouter.post('/', allowRoles('admin'), createSchedule);
scheduleRouter.delete('/:id', allowRoles('admin'), deleteSchedule);
