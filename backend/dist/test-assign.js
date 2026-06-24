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
async function testAssign() {
    const cls = await prisma.class.findFirst();
    const profile = await prisma.profile.findUnique({
        where: { email: 'teacher@campusflow.test' },
    });
    if (!cls || !profile) {
        console.log('Missing class or teacher profile');
        return;
    }
    const teacher = await prisma.teacher.findUnique({
        where: { profileId: profile.id }
    });
    if (!teacher) {
        console.log('Profile exists but no Teacher record found');
        return;
    }
    console.log(`Assigning Teacher ${teacher.id} (email: teacher@campusflow.test) to Class ${cls.id}`);
    try {
        const res = await prisma.class.update({
            where: { id: cls.id },
            data: {
                teacherId: teacher.id,
                institutionId: profile.institutionId
            }
        });
        console.log('Success!', res);
    }
    catch (e) {
        console.error('Error assigning:', e);
    }
}
testAssign().finally(() => prisma.$disconnect());
//# sourceMappingURL=test-assign.js.map