import fs from 'fs';
import path from 'path';

const desktopPath = 'c:/Users/laziz/Desktop';

try {
    const files = fs.readdirSync(desktopPath);
    console.log("📂 Files on Desktop matching 'mart':");
    files.forEach(file => {
        if (file.toLowerCase().includes('mart')) {
            console.log(`- "${file}" (length: ${file.length})`);
            const fullPath = path.join(desktopPath, file);
            console.log(`  Full path: ${fullPath}`);
            console.log(`  Exists: ${fs.existsSync(fullPath)}`);
        }
    });
} catch (err) {
    console.error("Error reading Desktop:", err);
}
