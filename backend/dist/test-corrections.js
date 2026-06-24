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
async function runE2ETest() {
    console.log('--- STARTING CORRECTIONS E2E TEST ---');
    const institution = await prisma.institution.findFirst();
    if (!institution)
        throw new Error('No institution found');
    const admin = await prisma.profile.findFirst({ where: { role: 'admin' } });
    const teacher = await prisma.profile.findFirst({ where: { role: 'teacher' } });
    if (!admin || !teacher)
        throw new Error('Need admin and teacher profiles');
    const student = await prisma.student.findFirst();
    const session = await prisma.attendanceSession.findFirst();
    if (!student || !session)
        throw new Error('Need student and session');
    const record = await prisma.attendanceRecord.create({
        data: {
            sessionId: session.id,
            studentId: student.id,
            status: 'absent'
        }
    });
    console.log(`✅ Step 1: Created Attendance Record (ID: ${record.id}) for Student ${student.firstName} as 'absent'`);
    const correction = await prisma.attendanceCorrection.create({
        data: {
            attendanceRecordId: record.id,
            requestedById: teacher.id,
            oldStatus: 'absent',
            newStatus: 'present',
            reason: 'Student arrived late but was marked absent',
            status: 'pending'
        }
    });
    console.log(`✅ Step 2: Teacher submitted correction (ID: ${correction.id})`);
    console.log('⏳ Step 3: Admin is approving the correction...');
    const updatedCorrection = await prisma.$transaction(async (tx) => {
        const updated = await tx.attendanceCorrection.update({
            where: { id: correction.id },
            data: {
                status: 'approved',
                adminNote: 'Verified with security camera',
                approvedById: admin.id,
                resolvedAt: new Date()
            }
        });
        await tx.attendanceRecord.update({
            where: { id: correction.attendanceRecordId },
            data: { status: 'present' }
        });
        await tx.auditLog.create({
            data: {
                institutionId: institution.id,
                actorId: admin.id,
                action: 'RESOLVED_ATTENDANCE_CORRECTION_APPROVED',
                entityType: 'AttendanceCorrection',
                entityId: correction.id,
                metadata: { oldStatus: 'absent', newStatus: 'present', note: 'Verified with security camera' }
            }
        });
        await tx.notification.create({
            data: {
                institutionId: institution.id,
                userId: teacher.id,
                title: 'Correction Approved',
                message: 'Your request was approved.',
                type: 'correction_request_approved',
                entityId: correction.id,
                entityType: 'attendance_correction'
            }
        });
        return updated;
    });
    console.log(`✅ Step 4: Correction Approved successfully! Status is now ${updatedCorrection.status}`);
    const finalRecord = await prisma.attendanceRecord.findUnique({ where: { id: record.id } });
    console.log(`✅ Step 5: Final Attendance Record status is: ${finalRecord?.status}`);
    if (finalRecord?.status === 'present') {
        console.log('🏆 E2E TEST PASSED!');
    }
    else {
        console.log('❌ E2E TEST FAILED! Record status did not update correctly.');
    }
}
runE2ETest()
    .catch(e => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=test-corrections.js.map