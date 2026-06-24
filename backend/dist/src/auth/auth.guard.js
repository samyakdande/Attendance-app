"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let SupabaseAuthGuard = class SupabaseAuthGuard extends (0, passport_1.AuthGuard)('supabase') {
    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        console.log(`[AUTH GUARD] Request to ${request.url}`);
        console.log(`[AUTH GUARD] Authorization Header:`, authHeader ? authHeader.substring(0, 50) + '...' : 'Missing');
        if (err || !user) {
            console.error(`[AUTH GUARD] Verification Failed!`);
            console.error(`[AUTH GUARD] Error:`, err);
            console.error(`[AUTH GUARD] Info:`, info);
            throw err || new common_1.UnauthorizedException('Authentication strictly failed. No bypass allowed.');
        }
        console.log(`[AUTH GUARD] Verification Succeeded for user:`, user.id);
        return user;
    }
};
exports.SupabaseAuthGuard = SupabaseAuthGuard;
exports.SupabaseAuthGuard = SupabaseAuthGuard = __decorate([
    (0, common_1.Injectable)()
], SupabaseAuthGuard);
//# sourceMappingURL=auth.guard.js.map