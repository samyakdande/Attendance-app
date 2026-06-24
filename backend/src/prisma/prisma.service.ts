import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const rawUrl = process.env.DATABASE_URL || '';
    if (!rawUrl) {
      throw new Error('DATABASE_URL is required for Prisma.');
    }
    
    // The node-postgres Pool handles the connection to PgBouncer natively.
    // However, it does NOT understand the '?pgbouncer=true' flag, which hangs the socket.
    const cleanUrl = rawUrl.replace('?pgbouncer=true', '').replace('&pgbouncer=true', '');
    
    const pool = new Pool({ connectionString: cleanUrl });
    const adapter = new PrismaPg(pool);
    
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
