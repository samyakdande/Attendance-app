# Phase 8.5: Productization, Notifications, Observability & Parent Portal Foundation

This plan outlines the architectural changes required to transition CampusFlow into an observable, production-ready Educational ERP, focusing heavily on Notification routing, system health, and Parent Portal backend readiness.

## User Review Required

> [!IMPORTANT]
> - We will be refactoring `TeacherDevice` into a generic `Device` model linked directly to `Profile` to support Push Notifications for Parents and Admins as well.
> - We will implement custom structured logging via global interceptors rather than relying on external services like Datadog to keep the local setup simple but production-ready.

## Proposed Changes

---

### Database Schema Updates

#### [MODIFY] `prisma/schema.prisma`
- Rename `TeacherDevice` to `Device` and link it to `Profile` instead of `Teacher`.
- Add `NotificationPreference` model linked to `Profile`.
- Ensure `Notification` model supports generic events.
- Update `AuditLog` to strictly enforce production logging requirements.

---

### Module 1 & 5: Notification Center & Push Readiness

#### [MODIFY] `backend/src/notifications/notifications.controller.ts`
- Implement grouping logic, search filters, and "Mark All As Read".

#### [NEW] `frontend/app/(tabs)/notifications.tsx`
- Create the full Notification Feed UI conforming to the brutalist-minimalist, warm light theme.

#### [MODIFY] `frontend/app/(tabs)/dashboard.tsx`
- Integrate the Notification Bell and Unread Counter into the header.

---

### Module 2 & 3: Observability & Production Logging

#### [NEW] `backend/src/health/health.controller.ts`
- Implement manual health checks for `/health`, `/health/database`, `/health/redis`, and `/health/supabase`.

#### [NEW] `backend/src/common/interceptors/logging.interceptor.ts`
- Build a structured request-tracing interceptor that logs API response times and tracks failed requests.

#### [MODIFY] `backend/src/common/filters/http-exception.filter.ts`
- Upgrade the error filter to implement centralized error tracking format.

#### [MODIFY] `backend/src/audit-logs/audit-logs.service.ts`
- Inject the audit logger deeply into Attendance and Corrections to satisfy Module 3 requirements.

---

### Module 4: Parent Portal Foundation

#### [NEW] `backend/src/parents/parents-portal.controller.ts`
#### [NEW] `backend/src/parents/services/parent-profile.service.ts`
#### [NEW] `backend/src/parents/services/parent-attendance.service.ts`
- Create the read-only backend foundation for the future Parent Portal mobile application, strictly restricting mutation access.

## Verification Plan

### Automated Tests
- Build and push the new Prisma schema.
- Hit the `/health` endpoints to verify Postgres and Redis connectivity.

### Manual Verification
- Start an attendance session and verify an automated "System Alert" or "Attendance Created" notification is generated.
- Check the Expo app to see the Notification Bell on the dashboard turn red with the unread count.
- Open the Notification Center and verify read/unread toggling works.
