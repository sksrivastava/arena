import { Post } from './post.entity';
import { User } from './user.entity';
export declare class Comment {
    id: number;
    postId: number;
    walletAddress: string;
    content: string;
    createdAt: Date;
    post: Post;
    user: User;
}
