import { AuthVerifyDto } from '../dto/auth-verify.dto';
export declare class AuthService {
    verifyWalletSignature(authVerifyDto: AuthVerifyDto): Promise<boolean>;
    generateNonce(): string;
}
