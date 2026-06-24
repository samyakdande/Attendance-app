# CampusFlow ERP: Production Hardening & Enterprise Readiness (v1.1)

This plan outlines the architecture and execution steps for transforming CampusFlow into a production-ready, enterprise-grade platform, based on the Version 1.1 Roadmap.

## User Review Required

> [!IMPORTANT]
> This roadmap introduces significant database schema modifications and complex offline-syncing mechanisms. Please review the proposed database changes below. Upon your approval, we will begin execution by migrating the database.

## Phase 8.1: Database Schema Overhaul

We will update `d:\app1\backend\prisma\schema.prisma` to support Priorities 2-9.

### [MODIFY] `schema.prisma`
- **Student Status & QR Management**: Add `status`, `qrStatus`, `qrVersion`, and `lastQrGeneratedAt` to the `Student` model.
- **Academic Years**: Add `AcademicYear` model and link it to `Class` and `AttendanceSession`.
- **Parent System**: Add `Parent` model linked to `Student`.
- **Notifications**: Add `Notification` model to handle alerts and announcements.
- **Audit Logging**: Add `AuditLog` model to track teacher/student/attendance mutations.
- **Attendance Corrections**: Add `AttendanceCorrection` model linked to `AttendanceRecord`.
- **Device Management**: Add `TeacherDevice` model linked to `Teacher`.

## Phase 8.2: Backend API Expansion

We will create the corresponding NestJS modules for the new schema:
- `AcademicYearsModule`
- `ParentsModule`
- `AuditLogModule` (Integrated via Prisma Middleware or Interceptors)
- `NotificationsModule`

## Phase 8.3: Priority 1 - Offline Attendance Support (React Native)

> [!TIP]
> To achieve zero-data-loss offline attendance, we will implement an "Optimistic Sync Queue" in the frontend.

1. **Local Storage**: Use `AsyncStorage` (or `expo-sqlite`) to maintain a `scan_queue`.
2. **Scanner Screen Modification**: 
   - Before `fetch`, check `NetInfo` (Network Status).
   - If offline, push the scan to the local queue, simulate a "Success" haptic response, and flag it as "Pending Sync" in the UI.
3. **Background Sync Worker**: When `NetInfo` detects connection restoration, automatically process the queue and reconcile conflicts with the NestJS backend.

## Phase 8.4: Observability & Security (Priorities 10-12)

- **Security**: Implement rate limiting (`@nestjs/throttler`), Helmet headers, and JWT rotation logic.
- **Observability**: Set up a global Exception Filter to log errors to a centralized tracking system (e.g., Winston/Sentry).
- **Database Performance**: Verify Prisma connection pooling and add compound indexes for heavily queried fields (e.g., `institutionId` + `deletedAt`).

## Verification Plan

### Automated Tests
- Run Prisma migrations successfully on Supabase.
- Execute a heavy load test script against the Attendance scanner endpoint using Artillery to ensure < 200ms latency.

### Manual Verification
- Turn off Wi-Fi on the simulator, scan 3 QRs, turn Wi-Fi back on, and verify the queue syncs to the server flawlessly.
