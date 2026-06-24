import { PrismaService } from '../prisma/prisma.service';
export declare class ParentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(institutionId: string): Promise<({
        students: ({
            student: {
                id: string;
                institutionId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                firstName: string;
                lastName: string;
                enrollmentNumber: string;
                email: string | null;
                phone: string | null;
                qrIdentifier: string;
                status: string;
                qrStatus: string;
                qrVersion: number;
                lastQrGeneratedAt: Date | null;
            };
        } & {
            createdAt: Date;
            studentId: string;
            parentId: string;
            relation: string;
        })[];
        profile: {
            id: string;
            institutionId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string;
        };
    } & {
        id: string;
        institutionId: string;
        createdAt: Date;
        status: string;
        profileId: string;
    })[]>;
}
