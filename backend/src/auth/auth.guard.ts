import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log(`[AUTH GUARD] Request to ${request.url}`);
    console.log(`[AUTH GUARD] Authorization Header:`, authHeader ? authHeader.substring(0, 50) + '...' : 'Missing');

    if (err || !user) {
      console.error(`[AUTH GUARD] Verification Failed!`);
      console.error(`[AUTH GUARD] Error:`, err);
      console.error(`[AUTH GUARD] Info:`, info);
      throw err || new UnauthorizedException('Authentication strictly failed. No bypass allowed.');
    }
    
    console.log(`[AUTH GUARD] Verification Succeeded for user:`, user.id);
    return user;
  }
}
