import fs from 'fs';
import path from 'path';

const searchDir = 'c:/Users/laziz/Desktop/Olmazor-maktabi';

console.log(`🔍 Searching recursively for '*mart dars jadvali*' inside: ${searchDir}`);

function searchFiles(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            if (file === 'node_modules' || file === '.git' || file === 'dist') {
                return; // Skip large or system directories
            }
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                results = results.concat(searchFiles(fullPath));
            } else if (file.toLowerCase().includes('mart dars jadvali')) {
                results.push({ name: file, path: fullPath, size: stat.size });
            }
        });
    } catch (e) {
        // Ignore read errors
    }
    return results;
}

const found = searchFiles(searchDir);
if (found.length > 0) {
    console.log(`\n🎉 Found ${found.length} matching file(s) inside the project folder:`);
    found.forEach(f => {
        console.log(`👉 File: "${f.name}"`);
        console.log(`👉 Full Path: "${f.path.replace(/\\/g, '/')}"`);
        console.log(`👉 Size: ${f.size} bytes\n`);
    });
} else {
    console.log("\n❌ No file matching 'mart dars jadvali' was found inside the project folder.");
}
