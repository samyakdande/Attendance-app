"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
const crypto_1 = require("crypto");
let SeedController = class SeedController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async runSeed() {
        console.log('🌱 Generating Field Test Data via API Endpoint...');
        try {
            const institutionId = 'e20e5291-b13a-47c1-8c9d-e92721fb540c';
            const adminProfileId = 'a1234567-b13a-47c1-8c9d-e92721fb540c';
            const teacherProfileId = '0121cb24-c11f-410d-bc2e-0cd0533d056a';
            const teacherId = 'b1234567-b13a-47c1-8c9d-e92721fb540c';
            await this.prisma.institution.upsert({
                where: { id: institutionId },
                update: {},
                create: { id: institutionId, name: 'CampusFlow Demo School', type: 'K-12' },
            });
            await this.prisma.profile.upsert({
                where: { id: adminProfileId },
                update: {},
                create: { id: adminProfileId, institutionId, role: 'admin', firstName: 'Admin', lastName: 'User', email: `admin_${adminProfileId.substring(0, 5)}@campusflow.test` }
            });
            await this.prisma.profile.upsert({
                where: { id: teacherProfileId },
                update: {},
                create: { id: teacherProfileId, institutionId, role: 'teacher', firstName: 'Lead', lastName: 'Teacher', email: `teacher_${teacherProfileId.substring(0, 5)}@campusflow.test` }
            });
            const existingTeacher = await this.prisma.teacher.findFirst({ where: { profileId: teacherProfileId } });
            const finalTeacherId = existingTeacher ? existingTeacher.id : teacherId;
            if (!existingTeacher) {
                await this.prisma.teacher.create({
                    data: { id: finalTeacherId, profileId: teacherProfileId, department: 'Science' },
                });
            }
            let academicYear = await this.prisma.academicYear.findFirst({
                where: { institutionId, name: '2026-2027 Field Test' }
            });
            if (!academicYear) {
                academicYear = await this.prisma.academicYear.create({
                    data: { id: 'c1234567-b13a-47c1-8c9d-e92721fb540c', institutionId, name: '2026-2027 Field Test', startDate: new Date('2026-08-01'), endDate: new Date('2027-06-01') },
                });
            }
            let testClass = await this.prisma.class.findFirst({
                where: { institutionId, name: 'Grade 7A' }
            });
            if (!testClass) {
                testClass = await this.prisma.class.create({
                    data: { id: 'd1234567-b13a-47c1-8c9d-e92721fb540c', institutionId, academicYearId: academicYear.id, academicYear: '2026-2027 Field Test', name: 'Grade 7A', teacherId: finalTeacherId },
                });
            }
            const classId = testClass.id;
            const studentData = [];
            const fs = require('fs');
            const path = require('path');
            const jsonPath = path.join(process.cwd(), 'test-students.json');
            const exportData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            for (let i = 1; i <= 120; i++) {
                const paddedNum = i.toString().padStart(3, '0');
                const studentJson = exportData.find((s) => s.enrollmentNumber === paddedNum);
                studentData.push({
                    institutionId,
                    firstName: 'Test Student',
                    lastName: paddedNum,
                    enrollmentNumber: paddedNum,
                    qrIdentifier: studentJson ? studentJson.qrIdentifier : (0, crypto_1.randomUUID)(),
                });
            }
            await this.prisma.student.createMany({ data: studentData, skipDuplicates: true });
            const createdStudents = await this.prisma.student.findMany({
                where: { institutionId },
            });
            const classStudentData = createdStudents.map(student => ({
                classId,
                studentId: student.id,
            }));
            await this.prisma.profile.updateMany({
                data: { role: 'admin' }
            });
            return { message: 'SUCCESS! All 120 students are now in your Supabase Database! (And everyone is now an Admin!)' };
        }
        catch (error) {
            console.error(error);
            return {
                message: 'ERROR DURING SEED',
                error: error.message || error.toString(),
                stack: error.stack
            };
        }
    }
};
exports.SeedController = SeedController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedController.prototype, "runSeed", null);
exports.SeedController = SeedController = __decorate([
    (0, common_1.Controller)('api/v1/seed'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeedController);
//# sourceMappingURL=seed.controller.js.map