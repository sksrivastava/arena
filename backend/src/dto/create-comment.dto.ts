import { IsString, IsNotEmpty, MaxLength, IsEthereumAddress } from 'class-validator';

export class CreateCommentDto {
  @IsEthereumAddress()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
} 