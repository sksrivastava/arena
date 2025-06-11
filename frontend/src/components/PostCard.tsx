'use client';

import { useState } from 'react';
import { PostCardProps } from '@/types';

export default function PostCard({ post, walletAddress, onLike, onComment }: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins > 0 ? `${diffMins}m ago` : 'just now';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleLike = async () => {
    if (!walletAddress) return;

    setIsLiking(true);
    try {
      await onLike(post.id);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress || !commentContent.trim()) return;

    setIsCommenting(true);
    try {
      await onComment(post.id, commentContent.trim());
      setCommentContent('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const userLiked = post.likes?.some(like => like.walletAddress === walletAddress);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
            {post.user?.username?.[0]?.toUpperCase() || formatAddress(post.walletAddress)[0]}
          </div>
          <div>
            <div className="font-medium text-foreground text-sm">
              {post.user?.username || formatAddress(post.walletAddress)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="text-foreground leading-relaxed">
        {post.content}
      </div>

      {/* Post Actions */}
      <div className="flex items-center space-x-6 pt-2 border-t border-border">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            userLiked
              ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
              : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
          }`}
        >
          <svg className="w-5 h-5" fill={userLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likeCount}</span>
        </button>

        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{commentCount}</span>
        </button>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <form onSubmit={handleComment} className="border-t border-border pt-4 space-y-3">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder:text-muted-foreground"
            rows={3}
            disabled={isCommenting}
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {500 - commentContent.length} characters left
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowCommentForm(false);
                  setCommentContent('');
                }}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCommenting || !commentContent.trim()}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isCommenting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments Display */}
      {post.comments && post.comments.length > 0 && (
        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="font-medium text-foreground">Comments</h4>
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm text-foreground">
                  {comment.user?.username || formatAddress(comment.walletAddress)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
              <div className="text-foreground text-sm">
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 