export interface User {
  walletAddress: string;
  username?: string;
  bio?: string;
  profilePicUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  walletAddress: string;
  content: string;
  createdAt: string;
  user?: User;
  likes?: Like[];
  comments?: Comment[];
}

export interface Like {
  postId: number;
  walletAddress: string;
  user?: User;
}

export interface Comment {
  id: number;
  postId: number;
  walletAddress: string;
  content: string;
  createdAt: string;
  user?: User;
}

export interface PostComposerProps {
  walletAddress: string;
  onPostCreated: (post: Post) => void;
}

export interface PostFeedProps {
  posts: Post[];
  loading: boolean;
  walletAddress: string;
  onPostUpdate: () => void;
}

export interface PostCardProps {
  post: Post;
  walletAddress: string;
  onLike: (postId: number) => void;
  onComment: (postId: number, content: string) => void;
} 