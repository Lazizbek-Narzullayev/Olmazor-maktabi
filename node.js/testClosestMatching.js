import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function testMatching() {
    console.log("📂 Opening Excel file...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    
    // 1. Get all teachers
    const teachers = [];
    for (let i = 3; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const name = row.getCell(6).value;
        const pos = row.getCell(3).value;
        if (name && typeof name === 'string') {
            const trimmedName = name.trim().replace(/\s+/g, ' ');
            if (
                trimmedName !== "Мактаб раҳбарияti" && 
                trimmedName !== "Мактаб раҳбарияti" && 
                trimmedName !== "Мактаб раҳбарияти" && 
                trimmedName !== "O'qituvchilar" && 
                trimmedName !== "Ф.И.Ш" &&
                trimmedName.length >= 3
            ) {
                teachers.push({
                    excelRow: i,
                    name: trimmedName,
                    position: pos ? pos.trim() : ''
                });
            }
        }
    }
    
    // 2. Get all Column-4 images
    const images = worksheet.getImages()
        .filter(img => img.range.tl.nativeCol === 3)
        .map((img, idx) => {
            const tl = img.range.tl;
            const nativeRowOff = tl.nativeRowOff || 0;
            const preciseY = tl.nativeRow + nativeRowOff / 1000000000;
            return {
                index: idx + 1,
                preciseRow: preciseY + 1,
                imageId: img.imageId
            };
        });
    
    console.log(`\n👥 Teachers: ${teachers.length}, 📸 Column-4 Images: ${images.length}\n`);
    
    // 3. For each teacher, find the closest image
    console.log("=== CLOSEST VERTICAL DISTANCE MATCHING ===");
    
    const matchedImageIds = new Set();
    
    teachers.forEach((t) => {
        // Find the image that has the minimum distance to T.excelRow
        let closestImg = null;
        let minDistance = Infinity;
        
        images.forEach((img) => {
            const distance = Math.abs(img.preciseRow - t.excelRow);
            if (distance < minDistance) {
                minDistance = distance;
                closestImg = img;
            }
        });
        
        // Let's only match if the distance is within 1.5 rows
        if (closestImg && minDistance < 1.5) {
            matchedImageIds.add(closestImg.imageId);
            console.log(`✅ Teacher: "${t.name}" (Row ${t.excelRow}) -> 📸 Matched Img #${closestImg.index} (preciseRow: ${closestImg.preciseRow.toFixed(4)}, dist: ${minDistance.toFixed(4)}) | ImageId: ${closestImg.imageId}`);
        } else {
            console.log(`❌ Teacher: "${t.name}" (Row ${t.excelRow}) -> 🚫 NO IMAGE FOUND NEARBY (min dist: ${minDistance.toFixed(4)})`);
        }
    });
}

testMatching().catch(console.error);
