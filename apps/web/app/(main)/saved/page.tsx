'use client';

import { Bookmark, Star } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export default function SavedPage() {
  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500'>
      <div className='relative mb-8'>
        <div className='absolute -inset-4 rounded-full bg-cyan-500/20 blur-xl animate-pulse' />
        <div className='relative h-24 w-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-6 transform hover:rotate-12 transition-transform duration-300'>
          <Bookmark className='h-12 w-12 text-white' />
        </div>
        <div className='absolute -top-2 -left-2 h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-150'>
          <Star className='h-4 w-4 text-yellow-900' />
        </div>
      </div>

      <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 mb-4'>
        Saved Items Coming Soon
      </h1>

      <p className='text-lg text-muted-foreground max-w-md mb-8'>
        Save jobs, posts, and profiles to revisit later. Your personal collection is being built right now.
      </p>

      <div className='flex gap-4'>
        <Link href='/feed'>
          <Button size='lg' className='rounded-full shadow-lg hover:shadow-primary/25 transition-all'>
            Back to Feed
          </Button>
        </Link>
        <Link href='/jobs'>
          <Button variant='outline' size='lg' className='rounded-full'>
            Explore Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
}
