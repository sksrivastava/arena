'use client';

import { useState } from 'react';
import { PostComposerProps } from '@/types';

export default function PostComposer({ walletAddress, onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const maxLength = 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || content.length > maxLength) return;
    
    setIsPosting(true);
    
    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          content: content.trim(),
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        onPostCreated(newPost);
        setContent('');
      } else {
        const error = await response.json();
        console.error('Failed to create post:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const charactersLeft = maxLength - content.length;
  const isOverLimit = charactersLeft < 0;
  const isEmpty = !content.trim();

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className={`w-full p-4 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors placeholder:text-muted-foreground text-foreground ${
              isOverLimit ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            rows={3}
            disabled={isPosting}
          />
          <div className={`absolute bottom-3 right-3 text-xs font-medium ${
            isOverLimit ? 'text-red-500' : charactersLeft < 20 ? 'text-yellow-500' : 'text-muted-foreground'
          }`}>
            {charactersLeft}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
          
          <button
            type="submit"
            disabled={isPosting || isEmpty || isOverLimit}
            className="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed text-sm"
          >
            {isPosting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span>Posting</span>
              </div>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
      
      {isOverLimit && (
        <div className="mt-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
          {Math.abs(charactersLeft)} characters over limit
        </div>
      )}
    </div>
  );
} 