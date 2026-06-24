import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';
export declare class AppController {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    checkDatabase(): Promise<{
        status: string;
        database: string;
    }>;
    seedTest(): Promise<{
        message: string;
        students: {
            name: string;
            qr: string;
        }[];
    }>;
}
