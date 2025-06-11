import { User } from './user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
export declare class Post {
    id: number;
    walletAddress: string;
    content: string;
    createdAt: Date;
    user: User;
    likes: Like[];
    comments: Comment[];
}
