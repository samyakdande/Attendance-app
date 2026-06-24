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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
const redis_service_1 = require("./redis/redis.service");
let AppController = class AppController {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async checkDatabase() {
        console.log('[HEALTH] Checking database connection...');
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            console.log(`[HEALTH] Database connection SUCCESS`);
            return { status: 'ok', database: 'connected' };
        }
        catch (error) {
            console.error(`[HEALTH] Database connection FAILED`, error);
            throw error;
        }
    }
    async seedTest() {
        const institution = await this.prisma.institution.create({
            data: { name: 'Test University', type: 'university' }
        });
        const profileId = '0121cb24-c11f-410d-bc2e-0cd0533d056a';
        const profile = await this.prisma.profile.upsert({
            where: { id: profileId },
            update: { institutionId: institution.id, role: 'teacher' },
            create: {
                id: profileId,
                institutionId: institution.id,
                role: 'teacher',
                firstName: 'Live',
                lastName: 'Teacher',
                email: 'live-teacher@campusflow.test'
            }
        });
        const teacher = await this.prisma.teacher.upsert({
            where: { profileId: profile.id },
            update: { department: 'CS' },
            create: { profileId: profile.id, department: 'CS' }
        });
        const cls = await this.prisma.class.create({
            data: {
                institutionId: institution.id,
                name: 'React Native 101',
                academicYear: '2026',
                teacherId: teacher.id
            }
        });
        const s1 = await this.prisma.student.upsert({
            where: { qrIdentifier: '3fd5a8bf-fc40-490c-b5b2-942b6e265bac' },
            update: {},
            create: {
                id: '3fd5a8bf-fc40-490c-b5b2-942b6e265bac',
                institutionId: institution.id,
                firstName: 'Jane',
                lastName: 'Smith',
                enrollmentNumber: 'JS1001',
                qrIdentifier: '3fd5a8bf-fc40-490c-b5b2-942b6e265bac'
            }
        });
        const s2 = await this.prisma.student.upsert({
            where: { qrIdentifier: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d' },
            update: {},
            create: {
                institutionId: institution.id,
                firstName: 'Alice',
                lastName: 'Johnson',
                enrollmentNumber: 'AJ1002',
                qrIdentifier: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'
            }
        });
        const s3 = await this.prisma.student.upsert({
            where: { qrIdentifier: 'f1e2d3c4-b5a6-4f1e-8d2c-3b4a5f6e7d8c' },
            update: {},
            create: {
                institutionId: institution.id,
                firstName: 'Bob',
                lastName: 'Williams',
                enrollmentNumber: 'BW1003',
                qrIdentifier: 'f1e2d3c4-b5a6-4f1e-8d2c-3b4a5f6e7d8c'
            }
        });
        try {
            await this.prisma.classStudent.create({ data: { classId: cls.id, studentId: s1.id } });
        }
        catch (e) { }
        try {
            await this.prisma.classStudent.create({ data: { classId: cls.id, studentId: s2.id } });
        }
        catch (e) { }
        try {
            await this.prisma.classStudent.create({ data: { classId: cls.id, studentId: s3.id } });
        }
        catch (e) { }
        return {
            message: 'Test students generated! You can now open your Expo app, tap Start Session, and scan the QR codes I provided.',
            students: [
                { name: 'Jane Smith', qr: s1.qrIdentifier },
                { name: 'Alice Johnson', qr: s2.qrIdentifier },
                { name: 'Bob Williams', qr: s3.qrIdentifier }
            ]
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('api/v1/health/database'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "checkDatabase", null);
__decorate([
    (0, common_1.Get)('seed-test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seedTest", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AppController);
//# sourceMappingURL=app.controller.js.map