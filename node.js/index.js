import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./utils/connectDB.js";
import { authRouter } from "./auth/authRoute.js";
import { usersRouter } from "./users/usersRoute.js";
import { classesRouter } from "./classes/classRoute.js";
import { subjectsRouter } from "./subjects/subjectRoute.js";
import { gradesRouter } from "./grades/gradeRoute.js";
import { scheduleRouter } from "./schedule/scheduleRoute.js";
import { applicationsRouter } from "./applications/applicationRoute.js";
import libraryRouter from "./library/libraryRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/subjects', subjectsRouter);
app.use('/grades', gradesRouter);
app.use('/schedule', scheduleRouter);
app.use('/applications', applicationsRouter);
app.use('/library', libraryRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('✅ Olmazor Maktab Server ishlayapti!');
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
});