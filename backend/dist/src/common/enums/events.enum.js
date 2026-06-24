"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.NotificationEvent = void 0;
var NotificationEvent;
(function (NotificationEvent) {
    NotificationEvent["ATTENDANCE_CREATED"] = "ATTENDANCE_CREATED";
    NotificationEvent["ATTENDANCE_SESSION_CLOSED"] = "ATTENDANCE_SESSION_CLOSED";
    NotificationEvent["ATTENDANCE_CORRECTION_SUBMITTED"] = "ATTENDANCE_CORRECTION_SUBMITTED";
    NotificationEvent["ATTENDANCE_CORRECTION_APPROVED"] = "ATTENDANCE_CORRECTION_APPROVED";
    NotificationEvent["ATTENDANCE_CORRECTION_REJECTED"] = "ATTENDANCE_CORRECTION_REJECTED";
    NotificationEvent["OFFLINE_SYNC_COMPLETED"] = "OFFLINE_SYNC_COMPLETED";
    NotificationEvent["STUDENT_CREATED"] = "STUDENT_CREATED";
    NotificationEvent["TEACHER_CREATED"] = "TEACHER_CREATED";
    NotificationEvent["QR_REGENERATED"] = "QR_REGENERATED";
    NotificationEvent["SYSTEM_ALERT"] = "SYSTEM_ALERT";
    NotificationEvent["SECURITY_ALERT"] = "SECURITY_ALERT";
})(NotificationEvent || (exports.NotificationEvent = NotificationEvent = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["ATTENDANCE_CREATED"] = "ATTENDANCE_CREATED";
    AuditAction["SESSION_CLOSED"] = "SESSION_CLOSED";
    AuditAction["CORRECTION_SUBMITTED"] = "CORRECTION_SUBMITTED";
    AuditAction["CORRECTION_APPROVED"] = "CORRECTION_APPROVED";
    AuditAction["CORRECTION_REJECTED"] = "CORRECTION_REJECTED";
    AuditAction["OFFLINE_SYNC_COMPLETED"] = "OFFLINE_SYNC_COMPLETED";
    AuditAction["STUDENT_CREATED"] = "STUDENT_CREATED";
    AuditAction["TEACHER_CREATED"] = "TEACHER_CREATED";
    AuditAction["QR_REGENERATED"] = "QR_REGENERATED";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
//# sourceMappingURL=events.enum.js.map