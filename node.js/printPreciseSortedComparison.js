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
                trimmedName !== "Мактаб раҳбарияti" && 
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
    
    // 2. Get all images sorted by precise Y coordinate
    const images = worksheet.getImages()
        .filter(img => img.range.tl.nativeCol === 3)
        .map((img, idx) => {
            const tl = img.range.tl;
            const nativeRowOff = tl.nativeRowOff || 0;
            const preciseY = tl.nativeRow + nativeRowOff / 1000000000;
            return {
                index: idx + 1,
                nativeRow: tl.nativeRow,
                excelRow: tl.nativeRow + 1,
                preciseY: preciseY,
                imageId: img.imageId
            };
        });
    images.sort((a, b) => a.preciseY - b.preciseY);
    
    console.log(`\n📊 Teachers count: ${teacherRows.length}`);
    console.log(`🖼️ Precise Sorted Column-4 Images: ${images.length}\n`);
    
    console.log("=== HIGH-PRECISION COMPARISON (Side-by-Side) ===");
    const maxLen = Math.max(teacherRows.length, images.length);
    for (let i = 0; i < maxLen; i++) {
        const t = teacherRows[i];
        const img = images[i];
        
        let tStr = t ? `Row ${t.excelRow}: "${t.name}"` : 'NO MORE TEACHERS';
        let imgStr = img ? `Img #${img.index} (Excel Row ${img.excelRow}, preciseY: ${img.preciseY.toFixed(9)}, ImageId ${img.imageId})` : 'NO MORE IMAGES';
        
        console.log(`${tStr.padEnd(65)} | ${imgStr}`);
    }
}

compare().catch(console.error);
