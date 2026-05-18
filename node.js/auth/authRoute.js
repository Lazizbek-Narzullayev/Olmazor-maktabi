import express from "express";
import { login, changePassword, getMe } from "./authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.get('/me', verifyToken, getMe);
authRouter.post('/change-password', verifyToken, changePassword);
