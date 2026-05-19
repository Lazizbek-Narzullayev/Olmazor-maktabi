import ExcelJS from 'exceljs';

const filePath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function inspect() {
    console.log("🚀 Loading workbook...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    console.log("\n📚 Sheets found:");
    workbook.worksheets.forEach((ws, idx) => {
        console.log(`- [${idx}] "${ws.name}" (${ws.rowCount} rows)`);
    });
    
    const ws = workbook.worksheets[0];
    console.log(`\n🔍 Inspecting first sheet "${ws.name}" (top 15 rows):`);
    for (let i = 1; i <= Math.min(15, ws.rowCount); i++) {
        const row = ws.getRow(i);
        const vals = [];
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            vals.push({ col: colNumber, val: cell.value });
        });
        console.log(`Row ${i}:`, vals.slice(0, 8));
    }
}

inspect().catch(console.error);
