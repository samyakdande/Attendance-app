import { Injectable, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase admin credentials missing');
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async teacherSignup(email: string, password?: string) {
    // 1. Verify email exists in Profile table (role: teacher)
    const existingProfile = await this.prisma.profile.findUnique({
      where: { email }
    });

    if (!existingProfile || existingProfile.role !== 'teacher') {
      throw new ForbiddenException('This email is not registered by your institution.');
    }

    // Default password as per requirements if none provided
    const pwd = password || 'testpass123';

    // 2. Create Supabase Auth account using Admin API
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
      throw new InternalServerErrorException(authError.message);
    }

    const newUserId = authData.user.id;

    // 3. Link Auth User -> Profile -> Teacher
    // Since primary keys cannot be easily cascaded, we create a new Profile with the new Auth ID
    // Re-link the existing Teacher, then delete the old Profile.
    await this.prisma.$transaction(async (prisma) => {
      // Find the teacher linked to the old profile
      const teacher = await prisma.teacher.findFirst({
        where: { profileId: existingProfile.id }
      });

      if (!teacher) {
        throw new InternalServerErrorException('Teacher record missing for this profile');
      }

      // Free up the email unique constraint on the old profile
      await prisma.profile.update({
        where: { id: existingProfile.id },
        data: { email: `migrated_${existingProfile.id}@campusflow.test` }
      });

      // Create new profile with the new Supabase Auth User ID
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

      // Update teacher to point to the new profile
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: { profileId: newUserId }
      });

      // Find any devices linked to the old profile and relink them or delete them
      // Relink devices
      await prisma.device.updateMany({
        where: { profileId: existingProfile.id },
        data: { profileId: newUserId }
      });

      // Relink requestedCorrections
      await prisma.attendanceCorrection.updateMany({
        where: { requestedById: existingProfile.id },
        data: { requestedById: newUserId }
      });
      
      // Relink approvedCorrections
      await prisma.attendanceCorrection.updateMany({
        where: { approvedById: existingProfile.id },
        data: { approvedById: newUserId }
      });

      // Finally, delete the old dummy profile
      await prisma.profile.delete({
        where: { id: existingProfile.id }
      });
    });

    return { message: 'Signup successful', userId: newUserId };
  }
}
