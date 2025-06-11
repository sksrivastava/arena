import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async ensureUserExists(walletAddress: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: { walletAddress }
    });

    if (!existingUser) {
      // Create a default user profile
      const user = new User();
      user.walletAddress = walletAddress;
      // Don't set optional fields, they will be undefined by default
      
      await this.usersRepository.save(user);
    }
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Ensure user exists before creating post
    await this.ensureUserExists(createPostDto.walletAddress);
    
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user', 'likes', 'comments', 'comments.user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'likes', 'comments', 'comments.user']
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async likePost(postId: number, walletAddress: string): Promise<void> {
    const post = await this.findOne(postId);
    
    // Ensure user exists before creating like
    await this.ensureUserExists(walletAddress);
    
    const existingLike = await this.likesRepository.findOne({
      where: { postId, walletAddress }
    });

    if (existingLike) {
      // Unlike the post
      await this.likesRepository.remove(existingLike);
    } else {
      // Like the post
      const like = this.likesRepository.create({ postId, walletAddress });
      await this.likesRepository.save(like);
    }
  }

  async addComment(commentData: CreateCommentDto & { postId: number }): Promise<Comment> {
    const { postId, walletAddress, content } = commentData;
    
    // Ensure user exists
    await this.ensureUserExists(walletAddress);
    
    // Check if post exists
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentsRepository.create({
      postId,
      walletAddress,
      content,
    });

    return await this.commentsRepository.save(comment);
  }
} 