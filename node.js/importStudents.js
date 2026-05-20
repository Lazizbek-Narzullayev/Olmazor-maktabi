import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Users } from './users/userModel.js';
import { Class } from './classes/classModel.js';
import { connectDB } from './utils/connectDB.js';

dotenv.config();

const stu5 = [
  { name: "Aliyev Murod", class: "5-A sinf", hobby: "Matematika, shaxmat", achievement: "Maktab olimpiadasi" },
  { name: "Karimova Madina", class: "6-B sinf", hobby: "Ingliz tili", achievement: "English quiz g‘olibi" },
  { name: "Rustamov Aziz", class: "7-A sinf", hobby: "Futbol", achievement: "Maktab jamoasi a’zosi" },
  { name: "Saidova Mohinur", class: "5-C sinf", hobby: "Rasm chizish", achievement: "Ijodiy tanlov" },
  { name: "Yo‘ldoshev Ibrohim", class: "6-A sinf", hobby: "Dasturlash", achievement: "Scratch loyiha" },
  { name: "Xasanov Umar", class: "7-B sinf", hobby: "Biologiya", achievement: "Fan haftaligi" },
  { name: "Qodirova Zilola", class: "5-B sinf", hobby: "She’riyat", achievement: "Ifodali o‘qish" },
  { name: "Jo‘rayev Sarvar", class: "6-C sinf", hobby: "Tarix", achievement: "Bilimlar bellashuvi" },
  { name: "Ergasheva Malika", class: "7-C sinf", hobby: "Kimyo", achievement: "Tajriba ko‘rgazmasi" },
  { name: "Nazarov Shohruh", class: "5-A sinf", hobby: "Futbol", achievement: "Sport haftaligi" },
  { name: "Abdullayeva Dilnoza", class: "6-B sinf", hobby: "Musiqa", achievement: "Qo‘shiq tanlovi" },
  { name: "Tursunov Jamshid", class: "7-A sinf", hobby: "Robototexnika", achievement: "Mini-robot loyihasi" },
  { name: "Ismoilov Bekzod", class: "5-C sinf", hobby: "Geografiya", achievement: "Xarita bellashuvi" },
  { name: "Rahimova Sabina", class: "6-A sinf", hobby: "Ingliz tili", achievement: "Speaking club" },
  { name: "To‘xtayev Diyor", class: "7-B sinf", hobby: "IT, Scratch", achievement: "Mini o‘yin yaratdi" }
];

const stu8 = [
  { name: "Aliyev Azizbek", class: "8-A sinf", hobby: "Matematika, shaxmat", achievement: "Tuman olimpiadasi g‘olibi" },
  { name: "Karimova Mohira", class: "9-B sinf", hobby: "Ingliz tili, debat", achievement: "IELTS mock 7.0" },
  { name: "Tursunov Jamshid", class: "10-A sinf", hobby: "Fizika, robototexnika", achievement: "Robot musobaqasi sovrindori" },
  { name: "Raximova Dilnoza", class: "8-C sinf", hobby: "Biologiya, san’at", achievement: "Viloyat tanlovi" },
  { name: "Ismoilov Bekzod", class: "9-A sinf", hobby: "Tarix, notiqlik", achievement: "Debat ligasi sardori" },
  { name: "Yo‘ldoshev Ibrohim", class: "10-B sinf", hobby: "Dasturlash, AI", achievement: "Web loyiha muallifi" },
  { name: "Saidova Malika", class: "8-B sinf", hobby: "Kimyo", achievement: "Fan haftaligi g‘olibi" },
  { name: "Nazarov Shohruh", class: "9-C sinf", hobby: "Futbol", achievement: "Maktab jamoasi sardori" },
  { name: "Qodirova Madina", class: "10-A sinf", hobby: "Adabiyot", achievement: "She’riyat tanlovi" },
  { name: "Rustamov Akmal", class: "8-A sinf", hobby: "Geografiya", achievement: "Xarita bellashuvi" },
  { name: "Xasanov Umar", class: "9-B sinf", hobby: "Biologiya", achievement: "Eko-loyiha muallifi" },
  { name: "Abdullayeva Zilola", class: "10-C sinf", hobby: "Grafik dizayn", achievement: "Poster tanlovi g‘olibi" },
  { name: "Jo‘rayev Sarvar", class: "8-C sinf", hobby: "Tarix", achievement: "Intellektual o‘yin" },
  { name: "Ergasheva Mohinur", class: "9-A sinf", hobby: "Ingliz tili", achievement: "Speaking club yetakchisi" },
  { name: "To‘xtayev Diyor", class: "10-B sinf", hobby: "IT, Startap", achievement: "Hackathon ishtirokchisi" }
];

const stu11 = [
  { name: "Aliyev Azizbek", class: "11-A sinf", hobby: "Matematika, fizika", achievement: "Respublika olimpiadasi sovrindori" },
  { name: "Karimova Mohira", class: "11-B sinf", hobby: "Ingliz tili, debat", achievement: "IELTS 7.5" },
  { name: "Tursunov Jamshid", class: "11-A sinf", hobby: "Fizika, robototexnika", achievement: "Startap loyihasi muallifi" },
  { name: "Raximova Dilnoza", class: "11-C sinf", hobby: "Biologiya", achievement: "Viloyat fan olimpiadasi" },
  { name: "Ismoilov Bekzod", class: "11-B sinf", hobby: "Tarix, notiqlik", achievement: "Debat turniri g‘olibi" },
  { name: "Yo‘ldoshev Ibrohim", class: "11-A sinf", hobby: "Dasturlash, AI", achievement: "Web ilova ishlab chiqdi" },
  { name: "Saidova Malika", class: "11-B sinf", hobby: "Kimyo", achievement: "Laboratoriya loyihasi" },
  { name: "Nazarov Shohruh", class: "11-C sinf", hobby: "Futbol", achievement: "Maktab jamoasi sardori" },
  { name: "Qodirova Madina", class: "11-A sinf", hobby: "Adabiyot", achievement: "Insho tanlovi g‘olibi" },
  { name: "Rustamov Akmal", class: "11-B sinf", hobby: "Geografiya", achievement: "Xarita musobaqasi" },
  { name: "Xasanov Umar", class: "11-C sinf", hobby: "Biologiya", achievement: "Eko-loyiha muallifi" },
  { name: "Abdullayeva Zilola", class: "11-A sinf", hobby: "Grafik dizayn", achievement: "Poster tanlovi g‘olibi" },
  { name: "Jo‘rayev Sarvar", class: "11-B sinf", hobby: "Tarix", achievement: "Intellektual o‘yin" },
  { name: "Ergasheva Mohinur", class: "11-C sinf", hobby: "Ingliz tili", achievement: "Speaking club yetakchisi" },
  { name: "To‘xtayev Diyor", class: "11-A sinf", hobby: "IT, startap", achievement: "Hackathon ishtirokchisi" }
];

const allStudents = [...stu5, ...stu8, ...stu11];

function generateUsername(fullName) {
    let name = fullName.toLowerCase()
        .replace(/o‘/g, 'o')
        .replace(/g‘/g, 'g')
        .replace(/sh/g, 'sh')
        .replace(/ch/g, 'ch')
        .replace(/o'/g, 'o')
        .replace(/g'/g, 'g')
        .replace(/ya/g, 'ya')
        .replace(/yu/g, 'yu')
        .replace(/yo/g, 'yo')
        .replace(/ye/g, 'ye')
        .replace(/ts/g, 'ts')
        .replace(/‘/g, '')
        .replace(/’/g, '')
        .replace(/'/g, '')
        .replace(/[^a-z\s]/g, '');

    const parts = name.split(/\s+/).filter(p => p.length > 2);
    if (parts.length >= 2) {
        return `${parts[1]}.${parts[0]}`; // first_name.last_name
    } else if (parts.length === 1) {
        return parts[0];
    }
    return 'student_' + Math.random().toString(36).substring(2, 7);
}

function normalizeName(name) {
    return name.replace(/\s+/g, '').replace(/sinf/i, '').replace(/[-_]/g, '').toLowerCase();
}

async function importStudents() {
    try {
        console.log("🚀 Connecting to MongoDB...");
        await connectDB();
        console.log("✅ Connected successfully!");

        const classes = await Class.find({});
        console.log(`📊 Found ${classes.length} classes in database.`);

        // Find or create default core teacher as placeholder for newly created classes
        const fallbackTeacher = await Users.findOne({ role: 'teacher' });

        let insertedCount = 0;
        let updatedCount = 0;

        for (const s of allStudents) {
            // Find class by name normalization
            const cleanRaw = normalizeName(s.class);
            let cls = classes.find(c => normalizeName(c.name) === cleanRaw);

            if (!cls) {
                // Determine a nice standard class name format like "5-A" or "11-A"
                const classParts = s.class.split(/\s+/)[0]; // e.g. "5-A" or "11-B"
                console.log(`⚠️ Class "${s.class}" not found. Creating a new one as "${classParts}"...`);
                
                cls = await Class.create({
                    name: classParts,
                    teacherId: fallbackTeacher?._id || null,
                    year: '2024-2025'
                });
                classes.push(cls);
            }

            // Check if student already exists in the database
            let user = await Users.findOne({ name: s.name, role: 'student' });
            
            if (user) {
                // Update existing student
                user.specialization = s.hobby;
                user.olympiads = [s.achievement];
                user.classId = cls._id;
                user.image = ''; // No photo, as requested
                await user.save();
                
                // Add to class studentIds if not already there
                if (!cls.studentIds.includes(user._id)) {
                    cls.studentIds.push(user._id);
                    await cls.save();
                }

                console.log(`🔄 Updated existing student: "${s.name}" -> Class: "${cls.name}"`);
                updatedCount++;
            } else {
                // Create a new student
                const baseUsername = generateUsername(s.name);
                let finalUsername = baseUsername;
                let counter = 1;
                while (await Users.findOne({ userName: finalUsername })) {
                    finalUsername = `${baseUsername}${counter}`;
                    counter++;
                }

                const plainPassword = `olmazor${Math.floor(100 + Math.random() * 900)}`;
                const hashedPassword = await bcrypt.hash(plainPassword, 10);

                user = await Users.create({
                    userName: finalUsername,
                    password: hashedPassword,
                    plainPassword: plainPassword,
                    name: s.name,
                    role: 'student',
                    image: '', // No photo, as requested
                    specialization: s.hobby,
                    olympiads: [s.achievement],
                    classId: cls._id,
                    isFirstLogin: true
                });

                // Add to class studentIds
                if (!cls.studentIds.includes(user._id)) {
                    cls.studentIds.push(user._id);
                    await cls.save();
                }

                console.log(`✅ Created student: "${s.name}" | Username: ${finalUsername} | Pass: ${plainPassword} | Class: "${cls.name}"`);
                insertedCount++;
            }
        }

        console.log(`\n🎉 Student import completed successfully!`);
        console.log(`📊 Stats: ${insertedCount} created, ${updatedCount} updated.`);

    } catch (error) {
        console.error("❌ Error occurred during import:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Database connection closed.");
    }
}

importStudents().catch(console.error);
