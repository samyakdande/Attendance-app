import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
export declare class RedisService extends Redis implements OnModuleDestroy {
    private configService;
    private readonly logger;
    private hasLoggedError;
    constructor(configService: ConfigService);
    onModuleDestroy(): void;
}
