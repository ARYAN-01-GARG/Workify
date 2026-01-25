'use client';

import React from 'react';
import { usePosts } from '@/hooks/use-posts';
import { PostCard, Post } from '@/components/feed/post-card';
import { Loader2 } from 'lucide-react';

interface ProfilePostsProps {
  userId: string;
}

export function ProfilePosts({ userId }: ProfilePostsProps) {
  const { data, isLoading } = usePosts({
    authorId: userId,
    limit: 1,
  });

  const posts = (data as any)?.data || [];

  if (isLoading) {
    return (
      <div className='flex justify-center p-6'>
        <Loader2 className='h-6 w-6 animate-spin text-violet-500' />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className='text-center py-8 bg-slate-900/40 border border-slate-800/60 rounded-2xl'>
        <p className='text-slate-400 text-sm'>No posts yet.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-bold text-white'>Recent Activity</h2>
      <div className='space-y-4'>
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
