import ExcelJS from 'exceljs';

const excelPath = 'c:/Users/laziz/Downloads/Olmazor TIM.xlsx';

async function inspect() {
    console.log("📂 Opening Excel file...");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    
    const images = worksheet.getImages();
    if (images.length > 0) {
        const firstImg = images[0];
        console.log("\n🔍 Keys of img.range:");
        console.log(Object.keys(firstImg.range));
        
        console.log("\n🔍 Flat values of img.range.tl:");
        const tl = firstImg.range.tl;
        for (const k of Object.keys(tl)) {
            if (typeof tl[k] !== 'object') {
                console.log(`   ${k}: ${tl[k]}`);
            }
        }
        
        if (firstImg.range.br) {
            console.log("\n🔍 Flat values of img.range.br:");
            const br = firstImg.range.br;
            for (const k of Object.keys(br)) {
                if (typeof br[k] !== 'object') {
                    console.log(`   ${k}: ${br[k]}`);
                }
            }
        }
    }
}

inspect().catch(console.error);
