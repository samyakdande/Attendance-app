"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const institutions_module_1 = require("./institutions/institutions.module");
const teachers_module_1 = require("./teachers/teachers.module");
const students_module_1 = require("./students/students.module");
const classes_module_1 = require("./classes/classes.module");
const redis_module_1 = require("./redis/redis.module");
const attendance_module_1 = require("./attendance/attendance.module");
const reports_module_1 = require("./reports/reports.module");
const academic_years_module_1 = require("./academic-years/academic-years.module");
const parents_module_1 = require("./parents/parents.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const notifications_module_1 = require("./notifications/notifications.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const seed_controller_1 = require("./seed.controller");
const attendance_corrections_module_1 = require("./attendance-corrections/attendance-corrections.module");
const health_module_1 = require("./health/health.module");
const metrics_module_1 = require("./metrics/metrics.module");
const admin_module_1 = require("./admin/admin.module");
const schedule_1 = require("@nestjs/schedule");
const jobs_module_1 = require("./jobs/jobs.module");
const storage_module_1 = require("./storage/storage.module");
const monitoring_module_1 = require("./monitoring/monitoring.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            institutions_module_1.InstitutionsModule,
            teachers_module_1.TeachersModule,
            students_module_1.StudentsModule,
            classes_module_1.ClassesModule,
            redis_module_1.RedisModule,
            attendance_module_1.AttendanceModule,
            reports_module_1.ReportsModule,
            academic_years_module_1.AcademicYearsModule,
            parents_module_1.ParentsModule,
            audit_logs_module_1.AuditLogsModule,
            notifications_module_1.NotificationsModule,
            attendance_corrections_module_1.AttendanceCorrectionsModule,
            health_module_1.HealthModule,
            metrics_module_1.MetricsModule,
            admin_module_1.AdminModule,
            jobs_module_1.JobsModule,
            storage_module_1.StorageModule,
            monitoring_module_1.MonitoringModule,
        ],
        controllers: [app_controller_1.AppController, seed_controller_1.SeedController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map