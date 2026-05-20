import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function diagnose() {
    console.log("📂 Opening Excel file...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    
    console.log("🖼️ Analyzing embedded images...");
    const images = worksheet.getImages();
    console.log(`Found ${images.length} images in the worksheet.\n`);
    
    // Sort images by their row index
    images.sort((a, b) => a.range.tl.nativeRow - b.range.tl.nativeRow);
    
    // Let's print out the first 25 image positions and the names on those rows
    for (let index = 0; index < Math.min(images.length, 30); index++) {
        const img = images[index];
        const nativeRow = img.range.tl.nativeRow;
        
        // ExcelJS nativeRow is 0-indexed. Let's see what is written in Column 6 (Name) of that row (1-indexed row number is nativeRow + 1)
        const excelRowIndex = nativeRow + 1;
        const row = worksheet.getRow(excelRowIndex);
        
        const teacherName = row.getCell(6).value;
        const position = row.getCell(3).value;
        
        console.log(`[Image #${index + 1}]`);
        console.log(`👉 Image Range Top-Left Native Row: ${nativeRow} (Excel Row ${excelRowIndex})`);
        console.log(`👉 Column 6 Name on this Row: "${teacherName || 'EMPTY'}"`);
        console.log(`👉 Column 3 Position on this Row: "${position || 'EMPTY'}"`);
        
        // Let's also check the name on neighboring rows to see if there is a shift
        const prevRowName = worksheet.getRow(excelRowIndex - 1).getCell(6).value;
        const nextRowName = worksheet.getRow(excelRowIndex + 1).getCell(6).value;
        console.log(`   (Excel Row ${excelRowIndex - 1} Name: "${prevRowName || 'EMPTY'}")`);
        console.log(`   (Excel Row ${excelRowIndex + 1} Name: "${nextRowName || 'EMPTY'}")`);
        console.log("-----------------------------------------------------------------");
    }
}

diagnose().catch(console.error);
