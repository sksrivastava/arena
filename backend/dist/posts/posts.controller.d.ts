import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto): Promise<import("../entities/post.entity").Post>;
    findAll(): Promise<import("../entities/post.entity").Post[]>;
    findOne(id: number): Promise<import("../entities/post.entity").Post>;
    likePost(id: number, walletAddress: string): Promise<{
        success: boolean;
    }>;
    addComment(id: number, createCommentDto: CreateCommentDto): Promise<import("../entities/comment.entity").Comment>;
}
