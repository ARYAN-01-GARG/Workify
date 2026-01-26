'use client';

import { Settings, Sliders } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500'>
      <div className='relative mb-8'>
        <div className='absolute -inset-4 rounded-full bg-slate-500/20 blur-xl animate-pulse' />
        <div className='relative h-24 w-24 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300'>
          <Settings className='h-12 w-12 text-white animate-[spin_10s_linear_infinite]' />
        </div>
        <div className='absolute -bottom-2 -right-2 h-9 w-9 bg-violet-500 rounded-full flex items-center justify-center shadow-lg animate-pulse'>
          <Sliders className='h-5 w-5 text-white' />
        </div>
      </div>

      <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-200 dark:to-slate-400 mb-4'>
        Settings Coming Soon
      </h1>

      <p className='text-lg text-muted-foreground max-w-md mb-8'>
        Customize your experience, manage account preferences, and privacy controls. We&apos;re fine-tuning the gears.
      </p>

      <div className='flex gap-4'>
        <Link href='/profile'>
          <Button size='lg' className='rounded-full shadow-lg hover:shadow-primary/25 transition-all'>
            Go to Profile
          </Button>
        </Link>
        <Link href='/feed'>
          <Button variant='outline' size='lg' className='rounded-full'>
            Back to Feed
          </Button>
        </Link>
      </div>
    </div>
  );
}
