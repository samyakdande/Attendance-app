import { Controller, Get, Res, HttpStatus, HttpException } from '@nestjs/common';
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
  async checkAll() {
    const dbHealth = await this.checkDatabaseStatus();
    const redisHealth = await this.checkRedisStatus();
    
    let overallStatus: 'healthy' | 'degraded' | 'down' = 'healthy';
    
    if (dbHealth === 'down') {
      overallStatus = 'down';
      throw new HttpException({
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: this.version,
        services: { database: dbHealth, redis: redisHealth }
      }, HttpStatus.SERVICE_UNAVAILABLE);
    } else if (redisHealth !== 'healthy') {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: this.version,
      services: { database: dbHealth, redis: redisHealth }
    };
  }

  @Get('database')
  async checkDatabase() {
    const status = await this.checkDatabaseStatus();
    if (status === 'down') {
      throw new HttpException(this.formatResponse('database', status), HttpStatus.SERVICE_UNAVAILABLE);
    }
    return this.formatResponse('database', status);
  }

  @Get('redis')
  async checkRedis() {
    const status = await this.checkRedisStatus();
    if (status === 'down') {
      throw new HttpException(this.formatResponse('redis', status), HttpStatus.SERVICE_UNAVAILABLE);
    }
    return this.formatResponse('redis', status);
  }

  @Get('supabase')
  async checkSupabase() {
    const status = await this.checkDatabaseStatus();
    if (status === 'down') {
      throw new HttpException(this.formatResponse('supabase', status), HttpStatus.SERVICE_UNAVAILABLE);
    }
    return this.formatResponse('supabase', status);
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
      console.error("PRISMA CONNECTION ERROR DETAILS:", error);
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
