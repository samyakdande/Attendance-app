import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

function main() {
  console.log('🌱 Generating Raw SQL for Field Test Data...');

  const institutionId = randomUUID();
  const adminProfileId = randomUUID();
  const teacherProfileId = randomUUID();
  const teacherId = randomUUID();
  const academicYearId = randomUUID();
  const classId = randomUUID();

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
    const studentId = randomUUID();
    studentIds.push(studentId);
    const paddedNum = i.toString().padStart(3, '0');
    const qrIdentifier = randomUUID();
    
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

  // 1. Output Raw SQL
  const sqlPath = path.join(process.cwd(), 'seed_field_test_data.sql');
  fs.writeFileSync(sqlPath, sql);

  // 2. Output JSON for the PDF script to read locally (Bypasses DB connection completely)
  const jsonPath = path.join(process.cwd(), 'test-students.json');
  fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2));

  console.log(`✅ Successfully generated Raw SQL script: seed_field_test_data.sql`);
  console.log(`✅ Exported 120 students to: test-students.json for offline PDF generation`);
}

main();
