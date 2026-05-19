import fs from 'fs';
import path from 'path';

const userProfile = process.env.USERPROFILE || 'c:/Users/laziz';

const pathsToTry = [
    path.join(userProfile, 'Desktop'),
    path.join(userProfile, 'OneDrive', 'Desktop'),
    path.join(userProfile, 'OneDrive', 'Рабочий стол'),
    path.join(userProfile, 'Downloads')
];

console.log("🔍 Searching for 'mart dars jadvali (2).xls' in common directories...");

let foundPath = null;

pathsToTry.forEach(dir => {
    console.log(`Checking: ${dir}`);
    if (fs.existsSync(dir)) {
        try {
            const files = fs.readdirSync(dir);
            const match = files.find(f => f.toLowerCase().includes('mart dars jadvali'));
            if (match) {
                foundPath = path.join(dir, match);
                console.log(`\n🎉 Found matching file!`);
                console.log(`👉 File: "${match}"`);
                console.log(`👉 Full Path: "${foundPath}"`);
                console.log(`👉 Size: ${fs.statSync(foundPath).size} bytes\n`);
            }
        } catch (e) {
            console.log(`   (Could not read directory: ${e.message})`);
        }
    } else {
        console.log(`   (Directory does not exist)`);
    }
});

if (!foundPath) {
    console.log("\n❌ File 'mart dars jadvali (2).xls' was not found in any of the checked directories.");
}
