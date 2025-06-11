import { IsString, IsOptional, IsEthereumAddress, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEthereumAddress()
  walletAddress: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  profilePicUrl?: string;
} 