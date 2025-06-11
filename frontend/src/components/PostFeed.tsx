'use client';

import { PostFeedProps } from '@/types';
import PostCard from './PostCard';

export default function PostFeed({ posts, loading, walletAddress, onPostUpdate }: PostFeedProps) {
  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
        }),
      });

      if (response.ok) {
        onPostUpdate();
      } else {
        const error = await response.json();
        console.error('Failed to like post:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          content,
        }),
      });

      if (response.ok) {
        onPostUpdate();
      } else {
        const error = await response.json();
        console.error('Failed to add comment:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-2 bg-muted rounded w-12"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
            <div className="flex items-center space-x-4 pt-3 border-t border-border">
              <div className="h-6 bg-muted rounded w-12"></div>
              <div className="h-6 bg-muted rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
        <p className="text-muted-foreground text-sm">
          Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          walletAddress={walletAddress}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}
      
      {posts.length >= 10 && (
        <div className="text-center py-6">
          <button className="text-primary hover:text-primary/80 font-medium text-sm">
            Load more
          </button>
        </div>
      )}
    </div>
  );
} 