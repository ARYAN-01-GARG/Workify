'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@repo/ui/components/card';

/**
 * Loading skeleton for PostCard component
 * Matches the visual structure of PostCard for seamless loading experience
 */
export function PostCardSkeleton() {
  return (
    <Card className='bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-4 overflow-hidden animate-pulse'>
      <CardHeader className='flex flex-row items-start gap-4 p-4 pb-2'>
        {/* Avatar skeleton */}
        <div className='h-10 w-10 rounded-full bg-slate-800' />
        <div className='flex-1 min-w-0 pt-0.5 space-y-2'>
          {/* Name skeleton */}
          <div className='h-4 w-32 bg-slate-800 rounded' />
          {/* Headline skeleton */}
          <div className='h-3 w-48 bg-slate-800/60 rounded' />
          {/* Date skeleton */}
          <div className='h-2 w-20 bg-slate-800/40 rounded' />
        </div>
      </CardHeader>

      <CardContent className='p-4 pt-1 pb-3'>
        {/* Content skeleton - multiple lines */}
        <div className='space-y-2'>
          <div className='h-4 w-full bg-slate-800 rounded' />
          <div className='h-4 w-full bg-slate-800 rounded' />
          <div className='h-4 w-3/4 bg-slate-800 rounded' />
        </div>

        {/* Optional image skeleton (50% of posts have images) */}
        <div className='mt-4 h-48 w-full bg-slate-800/50 rounded-lg' />
      </CardContent>

      <CardFooter className='px-2 py-1 border-t border-slate-800/50 bg-slate-950/20'>
        <div className='flex gap-1 w-full'>
          {/* Action buttons skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='flex-1 h-9 bg-slate-800/30 rounded-lg' />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
