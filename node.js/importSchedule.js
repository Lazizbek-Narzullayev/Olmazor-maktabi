import mongoose from 'mongoose';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import { Class } from './classes/classModel.js';
import { Users } from './users/userModel.js';
import { Schedule } from './schedule/scheduleModel.js';
import { connectDB } from './utils/connectDB.js';

const require = createRequire(import.meta.url);
const xlsx = require('xlsx');
dotenv.config();

const filePath = 'c:/Users/laziz/Desktop/fotima/mart dars jadvali (2).xls';

function matchTeacher(excelName, teachers) {
    if (!excelName) return null;
    const cleanExcel = excelName.toLowerCase().trim().split('|')[0].trim();
    if (!cleanExcel) return null;

    // Try exact match
    let match = teachers.find(t => t.name.toLowerCase().includes(cleanExcel) || cleanExcel.includes(t.name.toLowerCase()));
    if (match) return match;

    // Try matching by components (Surname Name)
    const parts = cleanExcel.split(/\s+/);
    if (parts.length >= 2) {
        const query = (parts[0] + ' ' + parts[1]).toLowerCase();
        match = teachers.find(t => t.name.toLowerCase().includes(query));
    }
    
    return match || null;
}

const DAY_MAP = {
    'Du': 'Dushanba',
    'Se': 'Seshanba',
    'Ch': 'Chorshanba',
    'Pa': 'Payshanba',
    'Ju': 'Juma'
};

async function importSchedule() {
    try {
        await connectDB();

        // 1. Clear existing classes and schedule
        await Class.deleteMany({});
        await Schedule.deleteMany({});

        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        const teachers = await Users.find({ role: 'teacher' });

        const SUBJECT_SPEC_MAP = {
            'matematika': ['matematika', 'algebra', 'geometriya'],
            'fizika': ['fizika', 'astronomiya'],
            'ingliz tili': ['ingliz', 'english', 'ielts'],
            'ona tili': ['ona tili', 'adabiyot', 'filolog', 'uzbek tili'],
            'rus tili': ['rus tili'],
            'tarix': ['tarix', 'huquq', 'tarikh', 'dunyo'],
            'biologiya': ['biolog', 'tabiiy', 'botanika', 'zoologiya', 'kimyo'],
            'informatika': ['informatika', 'it ', 'texnologiya', 'robotexnika'],
            'jismoniy tarbiya': ['jismoniy tarbiya', 'sport', 'jismoniy madaniyat'],
            'tarbiya': ['tarbiya fani', 'ma\'naviyat', 'odobnoma']
        };

        const findTeacherBySpec = (subject) => {
            const sub = subject.toLowerCase();
            let targetGroup = null;
            
            // Find which group this subject belongs to
            for (const [group, keywords] of Object.entries(SUBJECT_SPEC_MAP)) {
                if (keywords.some(k => sub.includes(k))) {
                    targetGroup = group;
                    break;
                }
            }
            if (!targetGroup) return null;

            // Find teachers whose specialization contains the group name specifically
            const matched = teachers.filter(t => {
                const spec = t.specialization?.toLowerCase() || '';
                if (targetGroup === 'tarbiya') {
                    // Avoid matching "Jismoniy tarbiya" for "Tarbiya" subject
                    return spec.includes('tarbiya') && !spec.includes('jismoniy');
                }
                if (targetGroup === 'jismoniy tarbiya') {
                    return spec.includes('jismoniy');
                }
                return spec.includes(targetGroup);
            });
            return matched.length > 0 ? matched[Math.floor(Math.random() * matched.length)] : null;
        };

        // 2. Identify Classes and create them with CORE teachers as leaders
        const classNamesRow = data[8];
        const classMap = {};
        
        // Find core teachers for class leadership
        const coreTeachers = teachers.filter(t => {
            const s = t.specialization?.toLowerCase() || '';
            return s.includes('matematika') || s.includes('tili') || s.includes('adabiyot') || s.includes('tarix') || s.includes('fizika');
        });

        let coreIdx = 0;
        for (let j = 3; j < classNamesRow.length; j++) {
            const className = classNamesRow[j];
            if (className && typeof className === 'string' && className.length > 0) {
                const leader = coreTeachers[coreIdx % coreTeachers.length];
                const cls = await Class.create({
                    name: className,
                    teacherId: leader?._id || teachers[0]._id,
                    year: '2024-2025'
                });
                coreIdx++;
                classMap[j] = cls._id;
                console.log(`✅ Created class ${className} (Leader: ${leader?.name})`);
            }
        }

        // 3. Process Schedule
        console.log('Processing lessons...');
        let currentDay = 'Dushanba';
        let lessonsCreated = 0;

        const lessonStarts = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (row[1] && typeof row[1] === 'number') {
                lessonStarts.push(i);
            }
        }

        for (let idx = 0; idx < lessonStarts.length; idx++) {
            const i = lessonStarts[idx];
            const row = data[i];
            const nextRowIdx = lessonStarts[idx + 1];

            if (row[0] && DAY_MAP[row[0].trim()]) {
                currentDay = DAY_MAP[row[0].trim()];
            }

            let teacherRow = [];
            if (nextRowIdx !== i + 1 && i + 1 < data.length) {
                const potTeacher = data[i + 1];
                if (!potTeacher[1] && (potTeacher[3] || potTeacher[4])) {
                    teacherRow = potTeacher;
                }
            }

            const timeRange = row[2] || '';
            const [startTime, endTime] = timeRange.split('-').map(t => t?.trim() || '');

            for (let j = 3; j < classNamesRow.length; j++) {
                const subjectName = row[j];
                const teacherName = teacherRow[j];
                const classId = classMap[j];

                if (subjectName && typeof subjectName === 'string' && subjectName.trim() !== '' && classId) {
                    let matchedTeacher = matchTeacher(teacherName, teachers);
                    
                    if (!matchedTeacher) {
                        matchedTeacher = findTeacherBySpec(subjectName);
                    }

                    // Strict Check: If still no match or specialization mismatch
                    if (!matchedTeacher) {
                        matchedTeacher = teachers[0]; // Fallback to first teacher as placeholder
                    }

                    await Schedule.create({
                        classId,
                        teacherId: matchedTeacher._id,
                        subjectName: subjectName.trim(),
                        dayOfWeek: currentDay,
                        startTime: startTime || '08:00',
                        endTime: endTime || '08:45',
                        room: 'Xona ' + (Math.floor(Math.random() * 20) + 1),
                        quarter: 3
                    });
                    lessonsCreated++;
                }
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Import finished! Lessons created: ${lessonsCreated}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (err) {
        console.error('❌ Global error:', err);
        process.exit(1);
    }
}

importSchedule();
