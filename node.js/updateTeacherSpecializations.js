import { connectDB } from './utils/connectDB.js';
import { Users } from './users/userModel.js';
import { Schedule } from './schedule/scheduleModel.js';
import mongoose from 'mongoose';

async function update() {
    console.log("🚀 Serverga ulanish...");
    await connectDB();
    
    console.log("🔍 Ustozlar ro'yxatini yuklash...");
    const teachers = await Users.find({ role: 'teacher' });
    console.log(`👥 Jami: ${teachers.length} ta ustoz topildi.`);
    
    let updatedCount = 0;
    
    for (const teacher of teachers) {
        // Ushbu ustoz beradigan darslardan birini jadvaldan qidiramiz
        const scheduleItem = await Schedule.findOne({ teacherId: teacher._id });
        
        if (scheduleItem && scheduleItem.subjectName) {
            let subject = scheduleItem.subjectName.trim();
            let spec = `${subject} o'qituvchisi`;
            
            // Ayrim fanlarni chiroyli guruhlaymiz
            const lowerSubject = subject.toLowerCase();
            if (lowerSubject === 'algebra' || lowerSubject === 'geometriya' || lowerSubject === 'matematika') {
                spec = "Matematika o'qituvchisi";
            } else if (lowerSubject === 'ona tili' || lowerSubject === 'adabiyot' || lowerSubject === 'ona tili va adabiyot') {
                spec = "O'zbek tili va adabiyoti o'qituvchisi";
            } else if (lowerSubject === 'rus tili' || lowerSubject === 'rus tili va adabiyoti') {
                spec = "Rus tili o'qituvchisi";
            } else if (lowerSubject === 'ingliz tili' || lowerSubject === 'english' || lowerSubject === 'ingliz') {
                spec = "Ingliz tili o'qituvchisi";
            } else if (lowerSubject === 'jismoniy tarbiya' || lowerSubject === 'jismoniy tarbiya va sport') {
                spec = "Jismoniy tarbiya o'qituvchisi";
            }
            
            teacher.specialization = spec;
            await teacher.save();
            console.log(`✅ Updated: "${teacher.name}" -> ${spec}`);
            updatedCount++;
        } else {
            console.log(`ℹ️ "${teacher.name}" uchun dars jadvalida dars topilmadi. Amaldagi lavozimi qoldi: "${teacher.specialization}"`);
        }
    }
    
    console.log(`\n🎉 Muvaffaqiyatli yakunlandi! Jami ${updatedCount} ta ustozning mutaxassisligi yangilandi.`);
    await mongoose.disconnect();
    console.log("🔌 Bazaga ulanish uzildi.");
    process.exit(0);
}

update().catch(console.error);
