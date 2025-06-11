import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthVerifyDto } from '../dto/auth-verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verify(@Body() authVerifyDto: AuthVerifyDto) {
    const isValid = await this.authService.verifyWalletSignature(authVerifyDto);
    
    if (!isValid) {
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }

    // In a production app, you'd generate and return a JWT token here
    return {
      success: true,
      walletAddress: authVerifyDto.walletAddress,
      message: 'Authentication successful'
    };
  }

  @Post('nonce')
  getNonce() {
    return {
      nonce: this.authService.generateNonce()
    };
  }
} 