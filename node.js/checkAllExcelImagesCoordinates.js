import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function check() {
    console.log("📂 Opening Excel file...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    
    console.log("🖼️ Details of all worksheet images:");
    const images = worksheet.getImages();
    
    images.forEach((img, idx) => {
        const tl = img.range.tl;
        const br = img.range.br;
        const row = tl.nativeRow + 1;
        const col = tl.nativeCol + 1;
        
        const teacherName = worksheet.getRow(row).getCell(6).value;
        
        console.log(`[Image #${idx + 1}]`);
        console.log(`📍 TL: Row=${tl.nativeRow} (Excel ${row}), Col=${tl.nativeCol} (Excel ${col})`);
        if (br) {
            console.log(`📍 BR: Row=${br.nativeRow}, Col=${br.nativeCol}`);
        } else {
            console.log(`📍 BR: Not defined`);
        }
        console.log(`📍 Col 6 Name: "${teacherName || 'EMPTY'}"`);
        console.log(`📍 ImageId: ${img.imageId}`);
        console.log("-----------------------------------------");
    });
}

check().catch(console.error);
