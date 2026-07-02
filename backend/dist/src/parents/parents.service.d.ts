import { PrismaService } from '../prisma/prisma.service';
export declare class ParentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(institutionId: string): Promise<({
        profile: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            institutionId: string;
            role: string;
        };
        students: ({
            student: {
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                institutionId: string;
            };
        } & {
            createdAt: Date;
            studentId: string;
            parentId: string;
            relation: string;
        })[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        institutionId: string;
        profileId: string;
    })[]>;
}
