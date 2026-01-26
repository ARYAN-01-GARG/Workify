'use client';

import { CreatePostWidget } from '@/components/feed/create-post-widget';
import { PostCard } from '@/components/feed/post-card';
import { PostCardSkeleton } from '@/components/feed/post-card-skeleton';
import { usePosts } from '@/hooks/use-posts';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { useSession } from 'next-auth/react';
import type { PostsResponse } from '@/types';

export default function FeedPage() {
  const { data: session } = useSession();
  const { data, isLoading, error, refetch, isFetching } = usePosts();

  // Properly type the response
  const postsData = data as PostsResponse | undefined;
  const posts = postsData?.data ?? [];

  return (
    <div className='space-y-6'>
      <CreatePostWidget />

      {/* Error State */}
      {error ? (
        <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between'>
          <div className='flex items-center gap-2 text-red-500 text-sm'>
            <AlertCircle className='h-4 w-4 shrink-0' />
            <span>{error instanceof Error ? error.message : 'Failed to load feed'}</span>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => refetch()}
            disabled={isFetching}
            className='text-red-400 hover:text-red-300 hover:bg-red-500/10'
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </div>
      ) : null}

      {/* Loading State */}
      {isLoading ? (
        <div className='space-y-4'>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : posts.length === 0 ? (
        /* Empty State */
        <div className='text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800'>
          <div className='max-w-sm mx-auto'>
            <div className='h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='h-8 w-8 text-slate-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-white mb-2'>No posts yet</h3>
            <p className='text-slate-400 text-sm'>Be the first to share something with your network!</p>
          </div>
        </div>
      ) : (
        /* Posts List */
        <div className='space-y-4'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={session?.user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
