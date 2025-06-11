'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/contexts/Web3Context';
import { WalletConnect } from '@/components/WalletConnect';
import PostComposer from '../components/PostComposer';
import PostFeed from '../components/PostFeed';
import { Post } from '../types';

export default function Home() {
  const { walletAddress, isConnected, isAuthenticated } = useWeb3();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Arena Social</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-primary-foreground font-bold text-2xl">A</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Welcome to Arena Social
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Connect your wallet to join the conversation
            </p>
            <WalletConnect />
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-12 h-12 border-2 border-muted rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Authenticate
            </h2>
            <p className="text-muted-foreground mb-8">
              Sign a message to verify your wallet
            </p>
            <WalletConnect />
          </div>
        ) : (
          <div className="space-y-6">
            <PostComposer 
              walletAddress={walletAddress}
              onPostCreated={handlePostCreated}
            />
            
            <PostFeed 
              posts={posts}
              loading={loading}
              walletAddress={walletAddress}
              onPostUpdate={fetchPosts}
            />
          </div>
        )}
      </main>
    </div>
  );
}
