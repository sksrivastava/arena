import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post(':id/like')
  async likePost(
    @Param('id', ParseIntPipe) id: number,
    @Body('walletAddress') walletAddress: string
  ) {
    await this.postsService.likePost(id, walletAddress);
    return { success: true };
  }

  @Post(':id/comment')
  addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto
  ) {
    // Set the postId from URL parameter after validation
    const commentData = {
      ...createCommentDto,
      postId: id
    };
    return this.postsService.addComment(commentData);
  }
} 