import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { AuthVerifyDto } from '../dto/auth-verify.dto';

@Injectable()
export class AuthService {
  async verifyWalletSignature(authVerifyDto: AuthVerifyDto): Promise<boolean> {
    try {
      const { walletAddress, message, signature } = authVerifyDto;
      
      // Verify the signature matches the wallet address
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      console.error('Error verifying wallet signature:', error);
      return false;
    }
  }

  generateNonce(): string {
    return `Login to decentralized social media. Nonce: ${Date.now()}`;
  }
} 