import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');

const filePath = 'c:/Users/laziz/Desktop/fotima/mart dars jadvali (2).xls';

async function analyzeSchedule() {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    for (let i = 77; i < data.length; i++) {
        if (data[i][0]) {
            console.log(`Row ${i + 1} Col 1:`, data[i][0]);
        }
    }
}

analyzeSchedule().catch(console.error);
