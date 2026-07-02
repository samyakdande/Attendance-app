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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const pdfkit_1 = __importDefault(require("pdfkit"));
const QRCode = __importStar(require("qrcode"));
const crypto_1 = require("crypto");
let AdminService = class AdminService {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async getDashboardStats(institutionId) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const [activeTeachers, activeStudents, activeClasses, pendingCorrections] = await Promise.all([
            this.prisma.teacher.count({ where: { profile: { institutionId }, status: 'active' } }),
            this.prisma.student.count({ where: { institutionId, status: 'active' } }),
            this.prisma.class.count({ where: { institutionId } }),
            this.prisma.attendanceCorrection.count({
                where: {
                    attendanceRecord: { session: { institutionId } },
                    status: 'pending'
                }
            })
        ]);
        const metricsToday = await this.prisma.systemMetric.findMany({
            where: {
                institutionId,
                date: today
            }
        });
        const getMetric = (name) => {
            const metric = metricsToday.find(m => m.metricName === name);
            return metric ? metric.metricValue : 0;
        };
        return {
            liveStats: {
                teachers: activeTeachers,
                students: activeStudents,
                classes: activeClasses,
                pendingCorrections
            },
            todayMetrics: {
                sessions: getMetric('total_sessions'),
                scans: getMetric('total_scans'),
                offlineSyncs: getMetric('offline_syncs')
            }
        };
    }
    async generateQrExportPdf(institutionId, options) {
        const whereClause = {
            institutionId,
            status: 'active'
        };
        if (options.selectedStudentIds && options.selectedStudentIds.length > 0) {
            whereClause.id = { in: options.selectedStudentIds };
        }
        else if (options.classId) {
            whereClause.classes = { some: { classId: options.classId } };
        }
        const students = await this.prisma.student.findMany({
            where: whereClause,
            include: {
                classes: { include: { class: { select: { name: true } } } },
            },
            orderBy: { lastName: 'asc' }
        });
        if (students.length === 0) {
            throw new common_1.NotFoundException('No students found for export.');
        }
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', async () => {
                try {
                    const pdfData = Buffer.concat(buffers);
                    const fileName = `exports/qr-export-${(0, crypto_1.randomUUID)()}.pdf`;
                    const result = await this.storageService.uploadFile('exports', fileName, pdfData, 'application/pdf');
                    const signedUrl = await this.storageService.getDownloadUrl('exports', fileName, 60 * 60);
                    resolve(signedUrl);
                }
                catch (error) {
                    reject(error);
                }
            });
            const colWidth = 260;
            const rowHeight = 180;
            const startX = 30;
            const startY = 30;
            let i = 0;
            const processStudents = async () => {
                for (const student of students) {
                    if (i > 0 && i % 8 === 0) {
                        doc.addPage();
                    }
                    const col = i % 2;
                    const row = Math.floor((i % 8) / 2);
                    const x = startX + col * (colWidth + 20);
                    const y = startY + row * (rowHeight + 20);
                    doc.rect(x, y, colWidth, rowHeight).stroke('#E6E6E1');
                    const qrPayload = student.qrIdentifier;
                    const qrBuffer = await QRCode.toBuffer(qrPayload, { margin: 1, width: 100, type: 'png' });
                    doc.image(qrBuffer, x + 150, y + 40, { width: 90 });
                    doc.fontSize(16).fillColor('#111111').text(`${student.firstName} ${student.lastName}`, x + 15, y + 40, { width: 130 });
                    doc.fontSize(10).fillColor('#666666').text(`ID: ${student.enrollmentNumber}`, x + 15, y + 65);
                    const className = student.classes[0]?.class?.name || 'Unassigned';
                    doc.fontSize(10).fillColor('#666666').text(`Class: ${className}`, x + 15, y + 80);
                    doc.fontSize(8).fillColor('#A0A0A0').text('CampusFlow Enterprise', x + 15, y + 150);
                    i++;
                }
                doc.end();
            };
            processStudents().catch(reject);
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], AdminService);
//# sourceMappingURL=admin.service.js.map