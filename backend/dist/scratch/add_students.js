"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function addStudents() {
    const institution = await prisma.institution.findFirst();
    const cls = await prisma.class.findFirst();
    if (!institution || !cls) {
        console.log("Run seed-test first!");
        return;
    }
    const s1 = await prisma.student.create({
        data: {
            institutionId: institution.id,
            firstName: 'Alice',
            lastName: 'Johnson',
            enrollmentNumber: 'AJ1002'
        }
    });
    const s2 = await prisma.student.create({
        data: {
            institutionId: institution.id,
            firstName: 'Bob',
            lastName: 'Williams',
            enrollmentNumber: 'BW1003'
        }
    });
    await prisma.classStudent.create({ data: { classId: cls.id, studentId: s1.id } });
    await prisma.classStudent.create({ data: { classId: cls.id, studentId: s2.id } });
    console.log("Alice:", s1.qrIdentifier);
    console.log("Bob:", s2.qrIdentifier);
}
addStudents();
//# sourceMappingURL=add_students.js.map