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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function main() {
    console.log('🌱 Generating Raw SQL for Field Test Data...');
    const institutionId = (0, crypto_1.randomUUID)();
    const adminProfileId = (0, crypto_1.randomUUID)();
    const teacherProfileId = (0, crypto_1.randomUUID)();
    const teacherId = (0, crypto_1.randomUUID)();
    const academicYearId = (0, crypto_1.randomUUID)();
    const classId = (0, crypto_1.randomUUID)();
    let sql = `-- CAMPUSFLOW FIELD TEST DATA SEED\n\n`;
    sql += `INSERT INTO institutions (id, name, type) VALUES ('${institutionId}', 'CampusFlow Demo School', 'K-12');\n\n`;
    sql += `INSERT INTO profiles (id, institution_id, role, first_name, last_name, email) VALUES 
  ('${adminProfileId}', '${institutionId}', 'admin', 'Admin', 'User', 'admin@campusflow.test'),
  ('${teacherProfileId}', '${institutionId}', 'teacher', 'Lead', 'Teacher', 'teacher@campusflow.test');\n\n`;
    sql += `INSERT INTO teachers (id, profile_id, department) VALUES ('${teacherId}', '${teacherProfileId}', 'Science');\n\n`;
    sql += `INSERT INTO academic_years (id, institution_id, name, start_date, end_date) VALUES 
  ('${academicYearId}', '${institutionId}', '2026-2027 Field Test', '2026-08-01 00:00:00', '2027-06-01 00:00:00');\n\n`;
    sql += `INSERT INTO classes (id, institution_id, academic_year_id, academic_year, name, teacher_id) VALUES 
  ('${classId}', '${institutionId}', '${academicYearId}', '2026-2027 Field Test', 'Grade 7A', '${teacherId}');\n\n`;
    sql += `INSERT INTO students (id, institution_id, first_name, last_name, enrollment_number, qr_identifier) VALUES \n`;
    const studentIds = [];
    const studentInserts = [];
    const exportData = [];
    for (let i = 1; i <= 120; i++) {
        const studentId = (0, crypto_1.randomUUID)();
        studentIds.push(studentId);
        const paddedNum = i.toString().padStart(3, '0');
        const qrIdentifier = (0, crypto_1.randomUUID)();
        studentInserts.push(`('${studentId}', '${institutionId}', 'Test Student', '${paddedNum}', '${paddedNum}', '${qrIdentifier}')`);
        exportData.push({
            firstName: 'Test Student',
            lastName: paddedNum,
            enrollmentNumber: paddedNum,
            className: 'Grade 7A',
            qrIdentifier
        });
    }
    sql += studentInserts.join(',\n') + ';\n\n';
    sql += `INSERT INTO class_students (class_id, student_id) VALUES \n`;
    const classStudentInserts = studentIds.map(sid => `('${classId}', '${sid}')`);
    sql += classStudentInserts.join(',\n') + ';\n\n';
    const sqlPath = path.join(process.cwd(), 'seed_field_test_data.sql');
    fs.writeFileSync(sqlPath, sql);
    const jsonPath = path.join(process.cwd(), 'test-students.json');
    fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2));
    console.log(`✅ Successfully generated Raw SQL script: seed_field_test_data.sql`);
    console.log(`✅ Exported 120 students to: test-students.json for offline PDF generation`);
}
main();
//# sourceMappingURL=generate-field-test-data.js.map