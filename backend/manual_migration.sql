-- Phase 8.1 Hardening Migration Script
-- Execute this entirely in the Supabase SQL Editor

-- 1. Alter Students Table
ALTER TABLE "students" 
ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN IF NOT EXISTS "qr_status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN IF NOT EXISTS "qr_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS "last_qr_generated_at" TIMESTAMP(3);

-- 2. Create Academic Years Table
CREATE TABLE IF NOT EXISTS "academic_years" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "institution_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "start_date" TIMESTAMP(3) NOT NULL,
  "end_date" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "academic_years_institution_id_name_key" ON "academic_years"("institution_id", "name");

-- 3. Update Classes & Sessions with Academic Year Reference
ALTER TABLE "classes" ADD COLUMN IF NOT EXISTS "academic_year_id" UUID;
ALTER TABLE "classes" ADD CONSTRAINT "classes_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "attendance_sessions" ADD COLUMN IF NOT EXISTS "academic_year_id" UUID;
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 4. Create Parent System
CREATE TABLE IF NOT EXISTS "parents" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "institution_id" UUID NOT NULL,
  "profile_id" UUID NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "parents_profile_id_key" ON "parents"("profile_id");

CREATE TABLE IF NOT EXISTS "parent_students" (
  "parent_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "relation" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("parent_id", "student_id"),
  FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Create Teacher Devices
CREATE TABLE IF NOT EXISTS "teacher_devices" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "teacher_id" UUID NOT NULL,
  "device_id" TEXT NOT NULL,
  "device_model" TEXT,
  "os_version" TEXT,
  "fcm_token" TEXT,
  "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "teacher_devices_teacher_id_device_id_key" ON "teacher_devices"("teacher_id", "device_id");

-- 6. Create Notifications
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "institution_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- 7. Create Attendance Corrections
CREATE TABLE IF NOT EXISTS "attendance_corrections" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "attendance_record_id" UUID NOT NULL,
  "requested_by_id" UUID NOT NULL,
  "approved_by_id" UUID,
  "old_status" TEXT NOT NULL,
  "new_status" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolved_at" TIMESTAMP(3),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("attendance_record_id") REFERENCES "attendance_records"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("requested_by_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("approved_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "attendance_corrections_attendance_record_id_key" ON "attendance_corrections"("attendance_record_id");
