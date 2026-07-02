import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    teacherSignup(body: {
        email: string;
        password?: string;
    }): Promise<{
        message: string;
        userId: string;
    }>;
}
