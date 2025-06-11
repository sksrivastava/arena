import { Post } from './post.entity';
import { User } from './user.entity';
export declare class Like {
    postId: number;
    walletAddress: string;
    post: Post;
    user: User;
}
