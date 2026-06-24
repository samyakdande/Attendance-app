import { PrismaService } from './prisma/prisma.service';
export declare class SeedController {
    private prisma;
    constructor(prisma: PrismaService);
    runSeed(): Promise<{
        message: string;
        error?: undefined;
        stack?: undefined;
    } | {
        message: string;
        error: any;
        stack: any;
    }>;
}
