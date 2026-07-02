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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    configService;
    supabase;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY');
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase admin credentials missing');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async teacherSignup(email, password) {
        const existingProfile = await this.prisma.profile.findUnique({
            where: { email }
        });
        if (!existingProfile || existingProfile.role !== 'teacher') {
            throw new common_1.ForbiddenException('This email is not registered by your institution.');
        }
        const pwd = password || 'testpass123';
        const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
            email,
            password: pwd,
            email_confirm: true,
            user_metadata: {
                first_name: existingProfile.firstName,
                last_name: existingProfile.lastName,
            }
        });
        if (authError) {
            this.logger.error('Failed to create Supabase user:', authError);
            throw new common_1.InternalServerErrorException(authError.message);
        }
        const newUserId = authData.user.id;
        await this.prisma.$transaction(async (prisma) => {
            const teacher = await prisma.teacher.findFirst({
                where: { profileId: existingProfile.id }
            });
            if (!teacher) {
                throw new common_1.InternalServerErrorException('Teacher record missing for this profile');
            }
            await prisma.profile.update({
                where: { id: existingProfile.id },
                data: { email: `migrated_${existingProfile.id}@campusflow.test` }
            });
            await prisma.profile.create({
                data: {
                    id: newUserId,
                    institutionId: existingProfile.institutionId,
                    role: existingProfile.role,
                    firstName: existingProfile.firstName,
                    lastName: existingProfile.lastName,
                    email: existingProfile.email,
                    phone: existingProfile.phone,
                }
            });
            await prisma.teacher.update({
                where: { id: teacher.id },
                data: { profileId: newUserId }
            });
            await prisma.device.updateMany({
                where: { profileId: existingProfile.id },
                data: { profileId: newUserId }
            });
            await prisma.attendanceCorrection.updateMany({
                where: { requestedById: existingProfile.id },
                data: { requestedById: newUserId }
            });
            await prisma.attendanceCorrection.updateMany({
                where: { approvedById: existingProfile.id },
                data: { approvedById: newUserId }
            });
            await prisma.profile.delete({
                where: { id: existingProfile.id }
            });
        });
        return { message: 'Signup successful', userId: newUserId };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map