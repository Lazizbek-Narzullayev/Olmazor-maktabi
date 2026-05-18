import express from "express";
import { createApplication, getAllApplications, updateApplicationStatus, deleteApplication } from "./applicationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

export const applicationsRouter = express.Router();

// Public - login siz ariza yuborish
applicationsRouter.post('/', createApplication);

// Admin only
applicationsRouter.use(verifyToken);
applicationsRouter.get('/', allowRoles('admin'), getAllApplications);
applicationsRouter.patch('/:id/status', allowRoles('admin'), updateApplicationStatus);
applicationsRouter.delete('/:id', allowRoles('admin'), deleteApplication);
