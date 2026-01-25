'use client';

import { CreatePostWidget } from '@/components/feed/create-post-widget';
import { PostCard, Post } from '@/components/feed/post-card';
import { usePosts } from '@/hooks/use-posts';
import { Loader2, AlertCircle } from 'lucide-react';

const Page = () => {
  const { data: rawData, isLoading, error } = usePosts();

  const posts = Array.isArray(rawData) ? rawData : (rawData as any)?.data || [];

  return (
    <div className='space-y-6'>
      <CreatePostWidget />

      {error ? (
        <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2 text-red-500 text-sm'>
          <AlertCircle className='h-4 w-4' />
          {error instanceof Error ? error.message : 'Failed to load feed'}
        </div>
      ) : null}

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-violet-500' />
        </div>
      ) : posts.length === 0 ? (
        <div className='text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800'>
          <p className='text-slate-400'>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
