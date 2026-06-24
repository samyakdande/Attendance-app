import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private hasLoggedError = false;

  constructor(private configService: ConfigService) {
    // In production, configure full Redis URL. For local, default localhost:6379 works.
    super(configService.get<string>('REDIS_URL') || 'redis://localhost:6379', {
      lazyConnect: true, // Do not connect until the first command is executed
      retryStrategy(times) {
        // Retry every 5 seconds instead of rapidly
        return 5000;
      },
      maxRetriesPerRequest: 0, // Fail fast if not connected
    });

    this.on('error', (err: any) => {
      if (!this.hasLoggedError) {
        const msg = err?.message || err?.name || 'Connection Refused';
        this.logger.error(`Redis connection failed: ${msg}. Please ensure Redis is running or REDIS_URL is configured.`);
        this.hasLoggedError = true;
      }
    });

    this.on('connect', () => {
      this.logger.log('Connected to Redis successfully');
      this.hasLoggedError = false;
    });
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
