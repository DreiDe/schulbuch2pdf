import { PDFDocument } from 'pdf-lib'
import fs from 'fs';

const folderPath = './images';
let currentPage = 0;
var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
let pages = fs.readdirSync(folderPath).sort(collator.compare);
const pdfDoc = await PDFDocument.create()

for (const file of pages) {
    currentPage++;
    const pngImageBytes = fs.readFileSync(`${folderPath}/${file}`);
    const page = pdfDoc.addPage([2155, 2949]);
    const pngImage = await pdfDoc.embedJpg(pngImageBytes);
    page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngImage.width,
        height: pngImage.height,
    });
}

const pdfBytes = await pdfDoc.save();
fs.writeFileSync(`${folderPath}/Buch.pdf`, pdfBytes);
