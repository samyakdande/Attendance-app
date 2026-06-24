"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const jwks_rsa_1 = require("jwks-rsa");
let SupabaseStrategy = class SupabaseStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'supabase') {
    configService;
    prisma;
    constructor(configService, prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            algorithms: ['ES256', 'HS256'],
            secretOrKeyProvider: (0, jwks_rsa_1.passportJwtSecret)({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: 'https://tqprwyqbxzdhdvvjzbys.supabase.co/auth/v1/.well-known/jwks.json',
            }),
        });
        this.configService = configService;
        this.prisma = prisma;
    }
    async validate(payload) {
        console.log('[SUPABASE STRATEGY] Validating JWT Payload:', JSON.stringify(payload));
        if (!payload || !payload.sub) {
            console.error('[SUPABASE STRATEGY] Invalid token payload: missing "sub"');
            throw new common_1.UnauthorizedException('Invalid token payload');
        }
        try {
            console.log(`[SUPABASE STRATEGY] Fetching profile for ID: ${payload.sub}`);
            let profile = await this.prisma.profile.findUnique({
                where: { id: payload.sub },
            });
            if (!profile && payload.email) {
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
            }
            else {
                console.log(`[SUPABASE STRATEGY] Profile found: Role=${profile.role}, Institution=${profile.institutionId}`);
            }
            const isDemoAdmin = !profile && payload.email?.startsWith('admin');
            const isDemoTeacher = !profile && payload.email?.startsWith('teacher');
            let fallbackRole = 'admin';
            return {
                id: payload.sub,
                email: payload.email,
                role: profile?.role || fallbackRole,
                institutionId: profile?.institutionId || 'e20e5291-b13a-47c1-8c9d-e92721fb540c',
            };
        }
        catch (dbError) {
            console.error('[SUPABASE STRATEGY] Database error during profile lookup:', dbError);
            throw new common_1.UnauthorizedException('Database lookup failed during authentication');
        }
    }
};
exports.SupabaseStrategy = SupabaseStrategy;
exports.SupabaseStrategy = SupabaseStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], SupabaseStrategy);
//# sourceMappingURL=supabase.strategy.js.map