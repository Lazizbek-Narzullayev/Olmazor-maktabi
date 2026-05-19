import ExcelJS from 'exceljs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';
import { Users } from './users/userModel.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const EXCEL_PATH = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Helper to transliterate Uzbek characters to clean English characters for username
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
        .replace(/ʻ/g, '')
        .replace(/ʼ/g, '')
        .replace(/[^a-z\s]/g, '');

    const parts = name.split(/\s+/).filter(p => p.length > 2);
    if (parts.length >= 2) {
        return `${parts[1]}.${parts[0]}`; // first_name.last_name
    } else if (parts.length === 1) {
        return parts[0];
    }
    return 'teacher_' + Math.random().toString(36).substring(2, 7);
}

// Generate a random but easy password like olmazor123
function generatePassword() {
    const num = Math.floor(100 + Math.random() * 900); // 3 digit number
    return `olmazor${num}`;
}

async function startImport() {
    try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
        console.log("🚀 Starting MongoDB Connection...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected successfully!");

        console.log("🚀 Loading Excel workbook...");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(EXCEL_PATH);
        const worksheet = workbook.worksheets[0];
        console.log(`✅ Excel Loaded! Found sheet "${worksheet.name}" with ${worksheet.rowCount} rows.`);

        // Ensure uploads directory exists
        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }

        // 1. Extract and map images from worksheet by row number
        console.log("🔍 Extracting embedded images from spreadsheet...");
        const imagesMap = {}; // Maps 1-based row number to image media info
        
        const worksheetImages = worksheet.getImages();
        console.log(`📸 Found ${worksheetImages.length} images in the worksheet.`);

        worksheetImages.forEach((img) => {
            const imgData = workbook.model.media.find(m => m.index === img.imageId);
            if (imgData) {
                // nativeRow is 0-indexed, convert to 1-indexed row number
                const rowNum = img.range.tl.nativeRow + 1;
                imagesMap[rowNum] = {
                    buffer: imgData.buffer,
                    extension: imgData.extension || 'png'
                };
            }
        });

        // 2. Loop through each row and import teachers
        console.log("\n👥 Processing rows and importing teachers...");
        let importedCount = 0;
        let skippedCount = 0;

        for (let i = 3; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            
            const rawName = row.getCell(6).value;
            const position = row.getCell(3).value;

            // Skip section headers or empty rows
            if (!rawName || typeof rawName !== 'string') continue;
            
            const trimmedName = rawName.trim().replace(/\s+/g, ' ');
            if (
                trimmedName === "Мактаб раҳбарияти" || 
                trimmedName === "O'qituvchilar" || 
                trimmedName === "Ф.И.Ш" ||
                trimmedName.length < 3
            ) {
                continue;
            }

            // Check if teacher already exists in the database
            const existingUser = await Users.findOne({ name: trimmedName, role: 'teacher' });
            if (existingUser) {
                console.log(`ℹ️ Row ${i}: "${trimmedName}" is already in the database. Skipping.`);
                skippedCount++;
                continue;
            }

            // Extract position/specialization
            const cleanPosition = position ? position.trim() : "o'qituvchi";

            // Map and save image if it exists for this row
            let imagePath = '';
            const rowImage = imagesMap[i];
            if (rowImage) {
                const imgFileName = `teacher_row_${i}_${Date.now()}.${rowImage.extension}`;
                const savePath = path.join(UPLOADS_DIR, imgFileName);
                fs.writeFileSync(savePath, rowImage.buffer);
                imagePath = `/uploads/${imgFileName}`;
                console.log(`📸 Saved image for Row ${i} (${trimmedName}) -> ${imgFileName}`);
            }

            // Generate Username
            let baseUsername = generateUsername(trimmedName);
            let finalUsername = baseUsername;
            let counter = 1;
            while (await Users.findOne({ userName: finalUsername })) {
                finalUsername = `${baseUsername}${counter}`;
                counter++;
            }

            // Generate Password
            const plainPassword = generatePassword();
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // Create User Document
            await Users.create({
                userName: finalUsername,
                password: hashedPassword,
                plainPassword: plainPassword,
                name: trimmedName,
                role: 'teacher',
                image: imagePath,
                specialization: cleanPosition,
                isFirstLogin: true
            });

            console.log(`✅ Imported Row ${i}: "${trimmedName}" (Role: ${cleanPosition}) | Username: ${finalUsername} | Password: ${plainPassword}`);
            importedCount++;
        }

        console.log(`\n🎉 Import completed successfully!`);
        console.log(`📊 Stats: ${importedCount} imported, ${skippedCount} skipped.`);
        
    } catch (error) {
        console.error("❌ Error occurred during import:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Database connection closed.");
        process.exit(0);
    }
}

startImport();
