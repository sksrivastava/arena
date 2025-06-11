import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';
export declare class User {
    walletAddress: string;
    username: string;
    bio: string;
    profilePicUrl: string;
    createdAt: Date;
    updatedAt: Date;
    posts: Post[];
    likes: Like[];
    comments: Comment[];
}
