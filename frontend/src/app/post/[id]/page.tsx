'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`);
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
      } else if (response.status === 404) {
        setPost(null);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    // Get wallet address from localStorage
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
    
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  const handleLike = async (postId: number) => {
    if (!walletAddress) {
      alert('Please connect your wallet to like posts');
      return;
    }

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
        // Refresh the post to get updated like counts
        fetchPost();
      } else {
        const error = await response.json();
        alert(`Failed to like post: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleComment = async (postId: number, content: string) => {
    if (!walletAddress) {
      alert('Please connect your wallet to comment');
      return;
    }

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
        // Refresh the post to show the new comment
        fetchPost();
      } else {
        const error = await response.json();
        alert(`Failed to add comment: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="flex items-center space-x-6 pt-2 border-t">
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.084-2.333.414-.7.814-1.454 1.178-2.267C8.235 8.425 10.062 7 12 7c1.938 0 3.765 1.425 4.906 3.4.364.813.764 1.567 1.178 2.267A7.962 7.962 0 0112 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Post Not Found</h3>
            <p className="text-gray-500 mb-6">
              The post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center text-blue-500 hover:text-blue-600 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Feed
          </Link>
        </div>

        {/* Post */}
        <PostCard
          post={post}
          walletAddress={walletAddress}
          onLike={handleLike}
          onComment={handleComment}
        />

        {/* Related Posts or Suggestions */}
        <div className="mt-8 text-center">
          <div className="text-gray-500 mb-4">
            Enjoying decentralized social media?
          </div>
          <div className="space-x-4">
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Explore More Posts
            </Link>
            {walletAddress && (
              <Link
                href="/profile"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                View Your Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 