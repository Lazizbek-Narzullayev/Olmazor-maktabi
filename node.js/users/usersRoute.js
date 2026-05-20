import express from "express";
import { getAllUsers, createUser, updateUser, deleteUser, getUserById, getPublicTeachers, getPublicStudents } from "./userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { localUpload } from "../utils/localUpload.js";

export const usersRouter = express.Router();

usersRouter.get('/public/teachers', getPublicTeachers);
usersRouter.get('/public/students', getPublicStudents);

usersRouter.use(verifyToken);

usersRouter.get('/', allowRoles('admin'), getAllUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', allowRoles('admin'), localUpload.single('image'), createUser);
usersRouter.patch('/:id', allowRoles('admin'), localUpload.single('image'), updateUser);
usersRouter.delete('/:id', allowRoles('admin'), deleteUser);