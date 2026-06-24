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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const rawUrl = process.env.DATABASE_URL || '';
const cleanUrl = rawUrl.replace('?pgbouncer=true', '').replace('&pgbouncer=true', '');
const pool = new pg_1.Pool({ connectionString: cleanUrl });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function testQrMapping() {
    console.log('--- QR Mapping Test ---');
    const students = await prisma.student.findMany({
        take: 5,
        orderBy: { lastName: 'asc' }
    });
    console.log('\nSample Students in DB:');
    students.forEach(s => {
        console.log(`- ${s.firstName} ${s.lastName} (ID: ${s.enrollmentNumber})`);
        console.log(`  QR: ${s.qrIdentifier}`);
    });
    if (students.length === 0) {
        console.log('No students found!');
        return;
    }
    const targetQr = students[0].qrIdentifier;
    console.log(`\nSimulating scan for QR: ${targetQr}`);
    const matchedStudent = await prisma.student.findUnique({
        where: { qrIdentifier: targetQr }
    });
    if (matchedStudent) {
        console.log(`✅ MATCHED: ${matchedStudent.firstName} ${matchedStudent.lastName}`);
        if (matchedStudent.id === students[0].id) {
            console.log(`✅ IDs MATCH PERFECTLY`);
        }
        else {
            console.log(`❌ IDS DO NOT MATCH! Expected ${students[0].id}, got ${matchedStudent.id}`);
        }
    }
    else {
        console.log(`❌ NO MATCH FOUND IN DB`);
    }
}
testQrMapping()
    .catch(e => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=test-qr.js.map