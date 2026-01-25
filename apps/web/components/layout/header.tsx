'use client';

import React from 'react';
import Link from 'next/link';
import { Search, MessageSquare, Bell } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';

const UserProfileMenuTrigger = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return <div className='h-8 w-8 rounded-full bg-slate-800 animate-pulse'></div>;

  return (
    <button className='flex items-center gap-2 hover:bg-slate-800/50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-800'>
      <Avatar className='h-8 w-8 border border-slate-700'>
        <AvatarImage src={user.avatarUrl!} alt={user.name!} />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className='text-sm font-medium text-slate-300 hidden xl:block max-w-[100px] truncate'>{user.name}</span>
    </button>
  );
};

export const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60'>
      <div className='container flex h-16 items-center justify-between mx-auto px-4'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center space-x-3 group'>
            <div className='h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 group-hover:scale-105 transition-all duration-300 ring-1 ring-white/10'>
              <span className='font-bold text-white text-xl'>W</span>
            </div>
            <span className='font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 hidden sm:inline-block tracking-tight'>
              Workify
            </span>
          </Link>
          <div className='relative hidden md:block w-96 group'>
            <Search className='absolute left-3.5 top-2.5 h-4 w-4 text-slate-500 group-focus-within:text-violet-400 transition-colors' />
            <input
              placeholder='Search jobs, companies, people...'
              className='w-full bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 placeholder:text-slate-600 shadow-sm'
            />
          </div>
        </div>

        <nav className='flex items-center gap-1 md:gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full w-10 h-10 transition-all duration-200'
          >
            <MessageSquare className='h-5 w-5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full w-10 h-10 relative transition-all duration-200'
          >
            <Bell className='h-5 w-5' />
            <span className='absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-slate-950 shadow-sm shadow-red-500/50'></span>
          </Button>
          <div className='h-8 w-px bg-slate-800/60 mx-2 hidden sm:block'></div>

          <div className='flex items-center gap-2 pl-1'>
            <UserProfileMenuTrigger />
          </div>
        </nav>
      </div>
    </header>
  );
};
