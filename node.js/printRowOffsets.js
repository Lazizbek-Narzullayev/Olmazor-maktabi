import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function check() {
    console.log("📂 Opening Excel file...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    
    const images = worksheet.getImages().filter(img => img.range.tl.nativeCol === 3);
    images.sort((a, b) => a.range.tl.nativeRow - b.range.tl.nativeRow);
    
    console.log("\n📐 Column-4 Images with Micro-Offsets:");
    images.forEach((img, idx) => {
        const tl = img.range.tl;
        const row = tl.nativeRow + 1;
        const rowOff = tl.rowOff || 0;
        
        // Calculate continuous row position
        // ExcelJS rowOff is in EMUs (English Metric Units). 1 row is roughly 120,000 to 180,000 EMUs depending on row height.
        // Let's print raw values first.
        const teacherName = worksheet.getRow(row).getCell(6).value;
        
        console.log(`[Image #${idx + 1}]`);
        console.log(`📍 TL Native Row: ${tl.nativeRow} (Excel ${row})`);
        console.log(`📍 Row Offset (rowOff): ${rowOff}`);
        console.log(`📍 Teacher Name on Row: "${teacherName || 'EMPTY'}"`);
        console.log(`📍 ImageId: ${img.imageId}`);
        console.log("-----------------------------------------");
    });
}

check().catch(console.error);
