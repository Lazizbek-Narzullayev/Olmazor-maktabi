import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function match() {
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
                trimmedName !== "Мактаб раҳбарияti" && 
                trimmedName !== "Мактаб раҳбарияти" && 
                trimmedName !== "O'qituvchilar" && 
                trimmedName !== "Ф.И.Ш" &&
                trimmedName.length >= 3
            ) {
                teachers.push({
                    id: teachers.length,
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
                id: idx,
                preciseRow: preciseY + 1,
                imageId: img.imageId
            };
        });
    
    console.log(`\n👥 Total Teachers: ${teachers.length}`);
    console.log(`📸 Total Images: ${images.length}`);
    
    // 3. Build all possible pairs and sort by distance
    const pairs = [];
    teachers.forEach((t) => {
        images.forEach((img) => {
            const distance = Math.abs(img.preciseRow - t.excelRow);
            pairs.push({ t, img, distance });
        });
    });
    
    pairs.sort((a, b) => a.distance - b.distance);
    
    // 4. Greedy matching
    const matchedTeachers = new Set();
    const matchedImages = new Set();
    const finalMatches = [];
    
    pairs.forEach((pair) => {
        if (!matchedTeachers.has(pair.t.id) && !matchedImages.has(pair.img.id)) {
            // Only match if within 1.5 rows
            if (pair.distance < 1.5) {
                matchedTeachers.add(pair.t.id);
                matchedImages.add(pair.img.id);
                finalMatches.push({
                    teacher: pair.t,
                    image: pair.img,
                    distance: pair.distance
                });
            }
        }
    });
    
    // 5. Print results
    console.log("\n🎯 GREEDY OPTIMAL MATCHING RESULTS:");
    teachers.forEach((t) => {
        const match = finalMatches.find(m => m.teacher.id === t.id);
        if (match) {
            console.log(`✅ Row ${t.excelRow}: "${t.name}" -> ImageId ${match.image.imageId} (dist: ${match.distance.toFixed(4)})`);
        } else {
            console.log(`🚫 Row ${t.excelRow}: "${t.name}" -> NO PHOTO ASSIGNED`);
        }
    });
    
    // Check unmatched images
    console.log("\n📸 UNMATCHED IMAGES:");
    images.forEach((img) => {
        if (!matchedImages.has(img.id)) {
            console.log(`⚠️ ImageId ${img.imageId} at Row ${img.preciseRow.toFixed(4)} was NOT matched.`);
        }
    });
}

match().catch(console.error);
