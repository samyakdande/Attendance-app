import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private configService;
    private readonly supabase;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    teacherSignup(email: string, password?: string): Promise<{
        message: string;
        userId: string;
    }>;
}
