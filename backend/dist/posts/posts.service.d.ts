import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
export declare class PostsService {
    private postsRepository;
    private likesRepository;
    private commentsRepository;
    private usersRepository;
    constructor(postsRepository: Repository<Post>, likesRepository: Repository<Like>, commentsRepository: Repository<Comment>, usersRepository: Repository<User>);
    ensureUserExists(walletAddress: string): Promise<void>;
    create(createPostDto: CreatePostDto): Promise<Post>;
    findAll(): Promise<Post[]>;
    findOne(id: number): Promise<Post>;
    likePost(postId: number, walletAddress: string): Promise<void>;
    addComment(commentData: CreateCommentDto & {
        postId: number;
    }): Promise<Comment>;
}
