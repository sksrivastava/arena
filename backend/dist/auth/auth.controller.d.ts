import { AuthService } from './auth.service';
import { AuthVerifyDto } from '../dto/auth-verify.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    verify(authVerifyDto: AuthVerifyDto): Promise<{
        success: boolean;
        walletAddress: string;
        message: string;
    }>;
    getNonce(): {
        nonce: string;
    };
}
