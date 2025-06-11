import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { walletAddress: createUserDto.walletAddress }
    });

    if (existingUser) {
      // Update existing user
      await this.usersRepository.update(
        { walletAddress: createUserDto.walletAddress },
        createUserDto
      );
      return this.findOne(createUserDto.walletAddress);
    }

    // Create new user
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(walletAddress: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { walletAddress },
      relations: ['posts', 'likes', 'comments']
    });

    if (!user) {
      throw new NotFoundException(`User with wallet address ${walletAddress} not found`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['posts']
    });
  }
} 