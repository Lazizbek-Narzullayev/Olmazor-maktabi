import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');

const filePath = 'c:/Users/laziz/Desktop/fotima/mart dars jadvali (2).xls';

async function checkExcel() {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    for (let i = 9; i < 25; i++) {
        const row = data[i];
        const type = (row[1] && typeof row[1] === 'number') ? 'LESSON' : 'OTHER';
        console.log(`Row ${i+1} [${type}]:`, row.slice(0, 6));
    }
}

checkExcel().catch(console.error);
