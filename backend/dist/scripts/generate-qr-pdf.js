"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QRCode = __importStar(require("qrcode"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function main() {
    console.log('🖨️  Starting QR PDF Export...');
    const jsonPath = path.join(process.cwd(), 'test-students.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('❌ test-students.json not found! Please run generate-field-test-data.ts first.');
        return;
    }
    const students = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const pdfPath = path.join(process.cwd(), 'qr-test-pack.pdf');
    const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);
    doc.fontSize(20).text('CampusFlow ERP - Field Test QR Pack', { align: 'center' });
    doc.moveDown(2);
    const cols = 3;
    const rows = 5;
    const itemWidth = 170;
    const itemHeight = 150;
    const startX = 40;
    let startY = doc.y;
    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const pageIndex = i % (cols * rows);
        if (pageIndex === 0 && i !== 0) {
            doc.addPage();
            startY = 40;
        }
        const col = pageIndex % cols;
        const row = Math.floor(pageIndex / cols);
        const x = startX + col * itemWidth;
        const y = startY + row * itemHeight;
        doc.rect(x, y, itemWidth - 10, itemHeight - 10).stroke('#CCC');
        const qrData = JSON.stringify({ studentIdentifier: student.qrIdentifier });
        const qrBuffer = await QRCode.toBuffer(qrData, { width: 80, margin: 1 });
        doc.image(qrBuffer, x + (itemWidth - 10) / 2 - 40, y + 5);
        doc.fontSize(10).fillColor('black');
        doc.text(`Student: ${student.firstName} ${student.lastName}`, x + 5, y + 90, { width: itemWidth - 20, align: 'center' });
        doc.text(`Roll No: ${student.enrollmentNumber}`, x + 5, y + 105, { width: itemWidth - 20, align: 'center' });
        doc.text(`Class: ${student.className}`, x + 5, y + 120, { width: itemWidth - 20, align: 'center' });
    }
    doc.end();
    writeStream.on('finish', () => {
        console.log(`✅ PDF successfully generated at: ${pdfPath}`);
        console.log(`🖨️  It contains ${students.length} highly legible, printable QR codes.`);
    });
}
main().catch(console.error);
//# sourceMappingURL=generate-qr-pdf.js.map