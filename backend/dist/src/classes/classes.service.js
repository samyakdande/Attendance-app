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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClassesService = class ClassesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(institutionId, data) {
        return this.prisma.class.create({
            data: {
                institutionId,
                name: data.name,
                academicYear: data.academicYear,
                teacherId: data.teacherId,
            },
        });
    }
    async findAll(institutionId, user) {
        let whereClause = {
            institutionId,
            deletedAt: null,
        };
        if (user?.role === 'teacher') {
            const teacher = await this.prisma.teacher.findUnique({
                where: { profileId: user.id }
            });
            if (!teacher)
                return [];
            whereClause.teacherId = teacher.id;
        }
        return this.prisma.class.findMany({
            where: whereClause,
            include: {
                teacher: {
                    include: { profile: true },
                },
                _count: {
                    select: { students: true },
                },
            },
        });
    }
    async findOne(institutionId, id, user) {
        let whereClause = {
            id,
            institutionId,
            deletedAt: null,
        };
        if (user?.role === 'teacher') {
            const teacher = await this.prisma.teacher.findUnique({
                where: { profileId: user.id }
            });
            if (!teacher)
                throw new common_1.NotFoundException(`Class with ID ${id} not found or you don't have access.`);
            whereClause.teacherId = teacher.id;
        }
        const cls = await this.prisma.class.findFirst({
            where: whereClause,
            include: {
                teacher: {
                    include: { profile: true },
                },
                students: {
                    include: { student: true },
                },
            },
        });
        if (!cls) {
            throw new common_1.NotFoundException(`Class with ID ${id} not found`);
        }
        return cls;
    }
    async update(institutionId, id, data) {
        await this.findOne(institutionId, id);
        return this.prisma.class.update({
            where: { id },
            data,
        });
    }
    async remove(institutionId, id) {
        await this.findOne(institutionId, id);
        return this.prisma.class.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async addStudentsToClass(institutionId, classId, studentIds) {
        await this.findOne(institutionId, classId);
        const data = studentIds.map((studentId) => ({
            classId,
            studentId,
        }));
        return this.prisma.classStudent.createMany({
            data,
            skipDuplicates: true,
        });
    }
    async removeStudentFromClass(institutionId, classId, studentId) {
        await this.findOne(institutionId, classId);
        return this.prisma.classStudent.delete({
            where: {
                classId_studentId: {
                    classId,
                    studentId
                }
            }
        });
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map