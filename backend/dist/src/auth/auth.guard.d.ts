import { ExecutionContext } from '@nestjs/common';
declare const SupabaseAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class SupabaseAuthGuard extends SupabaseAuthGuard_base {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
