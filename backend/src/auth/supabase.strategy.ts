import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['ES256', 'HS256'],
      // Dynamically fetch the ES256 public key from Supabase's JWKS endpoint
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://tqprwyqbxzdhdvvjzbys.supabase.co/auth/v1/.well-known/jwks.json',
      }),
    });
  }

  async validate(payload: any) {
    console.log('[SUPABASE STRATEGY] Validating JWT Payload:', JSON.stringify(payload));
    
    if (!payload || !payload.sub) {
      console.error('[SUPABASE STRATEGY] Invalid token payload: missing "sub"');
      throw new UnauthorizedException('Invalid token payload');
    }
    
    try {
      console.log(`[SUPABASE STRATEGY] Fetching profile for ID: ${payload.sub}`);
      // Fetch profile to get institution_id for multi-tenancy
      let profile = await this.prisma.profile.findUnique({
        where: { id: payload.sub },
      });

      if (!profile && payload.email) {
        // Look for a pre-provisioned profile (created by Admin with a fake UUID)
        const preProvisioned = await this.prisma.profile.findUnique({
          where: { email: payload.email },
        });

        if (preProvisioned) {
          console.log(`[SUPABASE STRATEGY] JIT Linking profile ${preProvisioned.id} to new Auth ID ${payload.sub}`);
          profile = await this.prisma.profile.update({
            where: { id: preProvisioned.id },
            data: { id: payload.sub },
          });
        }
      }

      if (!profile) {
        console.warn(`[SUPABASE STRATEGY] No profile found in database for ID: ${payload.sub}`);
      } else {
        console.log(`[SUPABASE STRATEGY] Profile found: Role=${profile.role}, Institution=${profile.institutionId}`);
      }

      // Fallback for Demo Test (if Postgres profile is missing but it's an admin demo email)
      const isDemoAdmin = !profile && payload.email?.startsWith('admin');
      const isDemoTeacher = !profile && payload.email?.startsWith('teacher');
      
      // Default to admin for local dev testing so the user doesn't get locked out
      let fallbackRole = 'admin'; 

      return {
        id: payload.sub,
        email: payload.email,
        role: profile?.role || fallbackRole,
        institutionId: profile?.institutionId || 'e20e5291-b13a-47c1-8c9d-e92721fb540c', // Ensure they always get the demo institution context
      };
    } catch (dbError) {
      console.error('[SUPABASE STRATEGY] Database error during profile lookup:', dbError);
      throw new UnauthorizedException('Database lookup failed during authentication');
    }
  }
}
