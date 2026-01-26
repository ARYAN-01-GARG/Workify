'use client';

import { Bell, Sparkles } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export default function NotificationsPage() {
  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500'>
      <div className='relative mb-8'>
        <div className='absolute -inset-4 rounded-full bg-pink-500/20 blur-xl animate-pulse' />
        <div className='relative h-24 w-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl -rotate-3 transform hover:-rotate-6 transition-transform duration-300'>
          <Bell className='h-12 w-12 text-white' />
        </div>
        <div className='absolute -top-2 -right-2 h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-100'>
          <Sparkles className='h-4 w-4 text-yellow-900' />
        </div>
      </div>

      <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600 mb-4'>
        Notifications Coming Soon
      </h1>

      <p className='text-lg text-muted-foreground max-w-md mb-8'>
        Get ready to stay updated with real-time alerts for job applications, connection requests, and more.
      </p>

      <div className='flex gap-4'>
        <Link href='/feed'>
          <Button size='lg' className='rounded-full shadow-lg hover:shadow-primary/25 transition-all'>
            Back to Feed
          </Button>
        </Link>
        <Link href='/jobs'>
          <Button variant='outline' size='lg' className='rounded-full'>
            Browse Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
}
