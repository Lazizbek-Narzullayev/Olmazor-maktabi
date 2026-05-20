import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the student files in frontend
const files = [
    path.join(__dirname, '../Olmazor/src/Components/Students1/Stu5.jsx'),
    path.join(__dirname, '../Olmazor/src/Components/Students1/Stu8.jsx'),
    path.join(__dirname, '../Olmazor/src/Components/Students1/Stu11.jsx')
];

console.log("🚀 Starting fallback images removal script...");

files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }

    console.log(`📄 Processing file: ${path.basename(filePath)}`);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace img: "https://..." or 'https://...' with img: ""
    const updatedContent = content.replace(/img:\s*["'][^"']*["']/g, 'img: ""');

    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Successfully removed fallback images from ${path.basename(filePath)}!`);
    } else {
        console.log(`ℹ️ No fallback images found or already removed in ${path.basename(filePath)}.`);
    }
});

console.log("🎉 Fallback images removal completed!");
