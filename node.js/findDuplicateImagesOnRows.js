import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function find() {
    console.log("📂 Opening Excel file...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    
    console.log("🖼️ Analyzing column-4 images...");
    const images = worksheet.getImages().filter(img => img.range.tl.nativeCol === 3);
    console.log(`Found ${images.length} images in column 4.\n`);
    
    // Sort images by nativeRow
    images.sort((a, b) => a.range.tl.nativeRow - b.range.tl.nativeRow);
    
    images.forEach((img, idx) => {
        const tl = img.range.tl;
        const row = tl.nativeRow + 1;
        const teacherName = worksheet.getRow(row).getCell(6).value;
        
        console.log(`[Col-4 Image #${idx + 1}]`);
        console.log(`📍 Excel Row: ${row} (Native Row ${tl.nativeRow})`);
        console.log(`📍 Teacher Name on this Row: "${teacherName || 'EMPTY'}"`);
        console.log(`📍 ImageId: ${img.imageId}`);
        console.log("-----------------------------------------");
    });
}

find().catch(console.error);
