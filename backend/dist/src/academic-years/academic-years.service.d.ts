import { PrismaService } from '../prisma/prisma.service';
export declare class AcademicYearsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(institutionId: string, data: {
        name: string;
        startDate: string;
        endDate: string;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        institutionId: string;
        name: string;
        startDate: Date;
        endDate: Date;
    }>;
    findAll(institutionId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        institutionId: string;
        name: string;
        startDate: Date;
        endDate: Date;
    }[]>;
}
