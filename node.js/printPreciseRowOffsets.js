import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function check() {
    console.log("📂 Opening Excel file...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    
    const images = worksheet.getImages().filter(img => img.range.tl.nativeCol === 3);
    
    // Sort by precise vertical coordinate: nativeRow + (nativeRowOff / 1,000,000,000)
    images.sort((a, b) => {
        const yA = a.range.tl.nativeRow + (a.range.tl.nativeRowOff || 0) / 1000000000;
        const yB = b.range.tl.nativeRow + (b.range.tl.nativeRowOff || 0) / 1000000000;
        return yA - yB;
    });
    
    console.log("\n📐 High-Precision Sorted Column-4 Images:");
    images.forEach((img, idx) => {
        const tl = img.range.tl;
        const row = tl.nativeRow + 1;
        const nativeRowOff = tl.nativeRowOff || 0;
        const preciseY = tl.nativeRow + nativeRowOff / 1000000000;
        
        const teacherName = worksheet.getRow(row).getCell(6).value;
        
        console.log(`[Image #${idx + 1}]`);
        console.log(`📍 Excel Row: ${row} (Native Row ${tl.nativeRow})`);
        console.log(`📍 Native Row Offset: ${nativeRowOff}`);
        console.log(`📍 Precise Y Coordinate: ${preciseY.toFixed(9)}`);
        console.log(`📍 Teacher Name on Row: "${teacherName || 'EMPTY'}"`);
        console.log(`📍 ImageId: ${img.imageId}`);
        console.log("-----------------------------------------");
    });
}

check().catch(console.error);
