import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, PrismaModule, ConfigModule],
  controllers: [AuthController],
  providers: [SupabaseStrategy, AuthService],
  exports: [SupabaseStrategy, PassportModule, AuthService],
})
export class AuthModule {}
