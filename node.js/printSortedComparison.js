import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function compare() {
    console.log("📂 Opening Excel file...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    
    // 1. Get all teacher rows with names
    const teacherRows = [];
    for (let i = 3; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const name = row.getCell(6).value;
        const pos = row.getCell(3).value;
        if (name && typeof name === 'string') {
            const trimmedName = name.trim().replace(/\s+/g, ' ');
            if (
                trimmedName !== "Мактаб раҳбарияти" && 
                trimmedName !== "O'qituvchilar" && 
                trimmedName !== "Ф.И.Ш" &&
                trimmedName.length >= 3
            ) {
                teacherRows.push({
                    excelRow: i,
                    name: trimmedName,
                    position: pos ? pos.trim() : ''
                });
            }
        }
    }
    
    // 2. Get all images sorted by their physical row coordinate (tl.nativeRow)
    const images = worksheet.getImages().map((img, idx) => {
        return {
            index: idx + 1,
            nativeRow: img.range.tl.nativeRow,
            excelRow: img.range.tl.nativeRow + 1,
            imageId: img.imageId
        };
    });
    images.sort((a, b) => a.nativeRow - b.nativeRow);
    
    console.log(`\n📊 Teachers count: ${teacherRows.length}`);
    console.log(`🖼️ Sorted Images count: ${images.length}\n`);
    
    console.log("=== COMPARISON (Side-by-Side) ===");
    const maxLen = Math.max(teacherRows.length, images.length);
    for (let i = 0; i < maxLen; i++) {
        const t = teacherRows[i];
        const img = images[i];
        
        let tStr = t ? `Row ${t.excelRow}: "${t.name}" (${t.position})` : 'NO MORE TEACHERS';
        let imgStr = img ? `Img #${img.index} (Excel Row ${img.excelRow}, ImageId ${img.imageId})` : 'NO MORE IMAGES';
        
        console.log(`${tStr.padEnd(70)} | ${imgStr}`);
    }
}

compare().catch(console.error);
