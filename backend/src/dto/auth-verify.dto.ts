import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class AuthVerifyDto {
  @IsEthereumAddress()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
} 