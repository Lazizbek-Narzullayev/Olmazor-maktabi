import { connectDB } from './utils/connectDB.js';
import { Users } from './users/userModel.js';
import { Class } from './classes/classModel.js';
import mongoose from 'mongoose';

async function redistribute() {
    console.log("🚀 Serverga ulanish...");
    await connectDB();
    
    console.log("🔍 Ustozlar va sinflarni yuklash...");
    const allTeachers = await Users.find({ role: 'teacher' });
    const classes = await Class.find({}).sort({ name: 1 });
    
    console.log(`👥 Jami: ${allTeachers.length} ta ustoz topildi.`);
    console.log(`🏫 Jami: ${classes.length} ta sinf topildi.`);
    
    // Haqiqiy dars beradigan ustozlarni ajratib olamiz (rahbariyat yoki hisobchini chetlab o'tamiz)
    const coreTeachers = allTeachers.filter(t => {
        const spec = t.specialization?.toLowerCase() || '';
        // Faqat haqiqiy fan o'qituvchilarini tanlaymiz
        return (spec.includes("o'qituvchisi") || spec.includes("o‘qituvchisi") || spec.includes("o'qituvchi") || spec.includes("o‘qituvchi")) &&
               !spec.includes("direktor") &&
               !spec.includes("hisobchi") &&
               !spec.includes("yordamchi");
    });
    
    if (coreTeachers.length === 0) {
        console.log("❌ O'qituvchilar topilmadi. Har qanday ustozdan foydalanamiz.");
        coreTeachers.push(...allTeachers);
    }
    
    console.log(`🎯 Rahbarlikka nomzod ustozlar soni: ${coreTeachers.length} ta.`);
    
    // Ustozlar ro'yxatini har safar har xil taqsimlash uchun tasodifiy aralashtiramiz (shuffle)
    const shuffledTeachers = [...coreTeachers].sort(() => Math.random() - 0.5);
    
    let index = 0;
    for (const cls of classes) {
        // Navbatma-navbat har bir sinfga bittadan ustoz biriktiramiz
        const leader = shuffledTeachers[index % shuffledTeachers.length];
        
        cls.teacherId = leader._id;
        await cls.save();
        
        console.log(`✅ Sinf: ${cls.name} -> Rahbar: "${leader.name}" (${leader.specialization})`);
        index++;
    }
    
    console.log(`\n🎉 Barcha ${classes.length} ta sinf rahbarlari muvaffaqiyatli qayta taqsimlandi!`);
    await mongoose.disconnect();
    console.log("🔌 Bazaga ulanish uzildi.");
    process.exit(0);
}

redistribute().catch(console.error);
