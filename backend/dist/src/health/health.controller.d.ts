import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class HealthController {
    private prisma;
    private redis;
    private readonly version;
    constructor(prisma: PrismaService, redis: RedisService);
    private formatResponse;
    checkAll(): Promise<{
        status: "healthy" | "degraded";
        timestamp: string;
        version: string;
        services: {
            database: "healthy";
            redis: "healthy" | "degraded" | "down";
        };
    }>;
    checkDatabase(): Promise<{
        status: "healthy" | "degraded" | "down";
        service: string;
        timestamp: string;
        version: string;
    }>;
    checkRedis(): Promise<{
        status: "healthy" | "degraded" | "down";
        service: string;
        timestamp: string;
        version: string;
    }>;
    checkSupabase(): Promise<{
        status: "healthy" | "degraded" | "down";
        service: string;
        timestamp: string;
        version: string;
    }>;
    getVersion(): {
        version: string;
        environment: string;
        status: string;
    };
    private checkDatabaseStatus;
    private checkRedisStatus;
}
