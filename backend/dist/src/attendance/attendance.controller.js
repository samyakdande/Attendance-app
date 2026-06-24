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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_decorator_1 = require("../auth/user.decorator");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    startSession(user, body) {
        return this.attendanceService.startSession(user.institutionId, user.id, body.classId);
    }
    scanQr(user, sessionId, body) {
        return this.attendanceService.scanQr(user.institutionId, sessionId, body.qrIdentifier);
    }
    getAllScans() {
        return this.attendanceService.getAllScans();
    }
    getSessionReport(sessionId, institutionId = 'b7fb51be-b661-49a3-b10c-52c3a618aab6') {
        return this.attendanceService.getSessionReport(institutionId, sessionId);
    }
    closeSession(user, sessionId) {
        return this.attendanceService.closeSession(user.institutionId, sessionId);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('sessions'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('sessions/:id/scan'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "scanQr", null);
__decorate([
    (0, common_1.Get)('report/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getAllScans", null);
__decorate([
    (0, common_1.Get)('sessions/:id/report'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('institutionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getSessionReport", null);
__decorate([
    (0, common_1.Put)('sessions/:id/close'),
    (0, roles_decorator_1.Roles)('admin', 'teacher'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "closeSession", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('api/v1/attendance'),
    (0, common_1.UseGuards)(auth_guard_1.SupabaseAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map