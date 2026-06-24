import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import type { Response } from 'express';
export declare class HealthController {
    private prisma;
    private redis;
    private readonly version;
    constructor(prisma: PrismaService, redis: RedisService);
    private formatResponse;
    checkAll(res: Response): Promise<Response<any, Record<string, any>>>;
    checkDatabase(res: Response): Promise<Response<any, Record<string, any>>>;
    checkRedis(res: Response): Promise<Response<any, Record<string, any>>>;
    checkSupabase(res: Response): Promise<Response<any, Record<string, any>>>;
    getVersion(): {
        version: string;
        environment: string;
        status: string;
    };
    private checkDatabaseStatus;
    private checkRedisStatus;
}
