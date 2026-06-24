import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import type { Response } from 'express';

@Controller('api/v1/health')
export class HealthController {
  private readonly version = '1.0.0';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  private formatResponse(service: string, status: 'healthy' | 'degraded' | 'down') {
    return {
      status,
      service,
      timestamp: new Date().toISOString(),
      version: this.version
    };
  }

  @Get()
  async checkAll(@Res() res: Response) {
    const dbHealth = await this.checkDatabaseStatus();
    const redisHealth = await this.checkRedisStatus();
    
    // Overall status logic
    let overallStatus: 'healthy' | 'degraded' | 'down' = 'healthy';
    let statusCode = HttpStatus.OK;

    if (dbHealth === 'down') {
      overallStatus = 'down';
      statusCode = HttpStatus.SERVICE_UNAVAILABLE;
    } else if (redisHealth !== 'healthy') {
      overallStatus = 'degraded';
    }

    return res.status(statusCode).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: this.version,
      services: {
        database: dbHealth,
        redis: redisHealth
      }
    });
  }

  @Get('database')
  async checkDatabase(@Res() res: Response) {
    const status = await this.checkDatabaseStatus();
    const statusCode = status === 'healthy' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(statusCode).json(this.formatResponse('database', status));
  }

  @Get('redis')
  async checkRedis(@Res() res: Response) {
    const status = await this.checkRedisStatus();
    const statusCode = status === 'down' ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.OK;
    return res.status(statusCode).json(this.formatResponse('redis', status));
  }

  @Get('supabase')
  async checkSupabase(@Res() res: Response) {
    // Supabase encompasses Auth, DB, and Storage. We'll check DB as a proxy for the project.
    const status = await this.checkDatabaseStatus();
    const statusCode = status === 'healthy' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(statusCode).json(this.formatResponse('supabase', status));
  }

  @Get('version')
  getVersion() {
    return {
      version: this.version,
      environment: process.env.NODE_ENV || 'development',
      status: 'healthy'
    };
  }

  private async checkDatabaseStatus(): Promise<'healthy' | 'down'> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'healthy';
    } catch (error) {
      return 'down';
    }
  }

  private async checkRedisStatus(): Promise<'healthy' | 'degraded' | 'down'> {
    try {
      // If we are strictly connected, ping will succeed quickly
      const result = await this.redis.ping();
      if (result === 'PONG') {
        return 'healthy';
      }
      return 'degraded';
    } catch (error) {
      return 'degraded'; // As per requirements, Redis down should be marked as degraded since we have Postgres fallback
    }
  }
}
