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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeachersService = class TeachersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(institutionId, data) {
        const existingProfile = await this.prisma.profile.findFirst({
            where: {
                OR: [
                    { id: data.profileId },
                    { email: data.email }
                ]
            },
        });
        if (existingProfile) {
            if (existingProfile.email === data.email) {
                throw new common_1.ConflictException('A profile with this email address already exists.');
            }
            throw new common_1.ConflictException('Profile ID already exists.');
        }
        return this.prisma.$transaction(async (prisma) => {
            const profile = await prisma.profile.create({
                data: {
                    id: data.profileId,
                    institutionId,
                    role: 'teacher',
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                },
            });
            const teacher = await prisma.teacher.create({
                data: {
                    profileId: profile.id,
                    department: data.department,
                },
                include: {
                    profile: true,
                },
            });
            return teacher;
        });
    }
    async findAll(institutionId) {
        return this.prisma.teacher.findMany({
            where: {
                profile: { institutionId },
                deletedAt: null,
            },
            include: {
                profile: true,
                classes: {
                    include: {
                        _count: {
                            select: { students: true }
                        }
                    }
                },
            },
        });
    }
    async findOne(institutionId, id) {
        const teacher = await this.prisma.teacher.findFirst({
            where: {
                id,
                profile: { institutionId },
                deletedAt: null,
            },
            include: {
                profile: true,
                classes: {
                    include: {
                        _count: {
                            select: { students: true }
                        }
                    }
                },
                sessions: {
                    orderBy: { startTime: 'desc' },
                    take: 10,
                    include: { class: true }
                }
            },
        });
        if (!teacher) {
            throw new common_1.NotFoundException(`Teacher with ID ${id} not found`);
        }
        return teacher;
    }
    async update(institutionId, id, data) {
        const teacher = await this.findOne(institutionId, id);
        return this.prisma.$transaction(async (prisma) => {
            if (data.firstName || data.lastName || data.phone !== undefined) {
                await prisma.profile.update({
                    where: { id: teacher.profileId },
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                    },
                });
            }
            return prisma.teacher.update({
                where: { id },
                data: {
                    department: data.department,
                    status: data.status,
                },
                include: {
                    profile: true,
                },
            });
        });
    }
    async assignClass(institutionId, id, classId) {
        const teacher = await this.findOne(institutionId, id);
        const cls = await this.prisma.class.findFirst({ where: { id: classId, institutionId } });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        return this.prisma.class.update({
            where: { id: classId },
            data: { teacherId: teacher.id }
        });
    }
    async removeClass(institutionId, id, classId) {
        const teacher = await this.findOne(institutionId, id);
        const cls = await this.prisma.class.findFirst({ where: { id: classId, institutionId, teacherId: teacher.id } });
        if (!cls)
            throw new common_1.NotFoundException('Class not found or not assigned to this teacher');
        return this.prisma.class.update({
            where: { id: classId },
            data: { teacherId: null }
        });
    }
    async getDashboardStats(institutionId, profileId) {
        const teacher = await this.prisma.teacher.findFirst({
            where: { profileId, profile: { institutionId }, deletedAt: null },
            include: { profile: true },
        });
        if (!teacher)
            throw new common_1.NotFoundException('Teacher not found');
        const classes = await this.prisma.class.findMany({
            where: { teacherId: teacher.id, institutionId },
        });
        const sessions = await this.prisma.attendanceSession.findMany({
            where: { teacherId: teacher.id, institutionId },
        });
        const stats = {
            classesToday: classes.length,
            sessionsCompleted: sessions.length,
            attendanceToday: 92
        };
        const notifications = await this.prisma.notification.findMany({
            where: { institutionId, userId: profileId },
            orderBy: { createdAt: 'desc' },
            take: 3
        });
        const unreadCount = await this.prisma.notification.count({
            where: { institutionId, userId: profileId, isRead: false }
        });
        return {
            teacher: {
                id: teacher.id,
                name: `${teacher.profile.firstName} ${teacher.profile.lastName}`
            },
            stats,
            classes: classes.map(c => ({
                id: c.id,
                name: c.name,
                time: '08:00 AM',
                status: 'UPCOMING'
            })),
            notifications: notifications.map(n => ({
                id: n.id,
                title: n.title,
                details: n.message,
                time: n.createdAt,
                isRead: n.isRead
            })),
            unreadCount
        };
    }
    async remove(institutionId, id) {
        const teacher = await this.findOne(institutionId, id);
        return this.prisma.$transaction(async (prisma) => {
            await prisma.profile.update({
                where: { id: teacher.profileId },
                data: { deletedAt: new Date() },
            });
            return prisma.teacher.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        });
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map