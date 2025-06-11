import { IsString, IsNotEmpty, MaxLength, IsEthereumAddress } from 'class-validator';

export class CreatePostDto {
  @IsEthereumAddress()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;
} 