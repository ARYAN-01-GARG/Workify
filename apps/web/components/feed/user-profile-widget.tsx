'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export const UserProfileWidget = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className='bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden group hover:border-violet-500/30 transition-all duration-300'>
      {/* Cover Image Area */}
      <div className='h-24 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300'></div>
      </div>

      <div className='px-5 pb-5 relative'>
        <div className='flex justify-between items-end -mt-10 mb-3'>
          <Avatar className='h-20 w-20 border-4 border-slate-950 shadow-lg cursor-pointer transition-transform duration-300 group-hover:scale-105'>
            <AvatarImage src={user.avatarUrl!} alt={user.name!} />
            <AvatarFallback className='bg-slate-800 text-violet-400 text-xl font-bold'>
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Link href='/profile'>
            <Button
              size='sm'
              variant='outline'
              className='text-xs h-8 bg-transparent border-slate-600 text-slate-300 hover:text-white hover:border-violet-500 hover:bg-violet-500/10'
            >
              View Profile
            </Button>
          </Link>
        </div>

        <div className='mb-4'>
          <h3 className='font-bold text-white text-lg leading-tight hover:text-violet-400 cursor-pointer transition-colors max-w-full truncate'>
            {user.name}
          </h3>
          <p className='text-slate-400 text-sm mt-1 line-clamp-1'>Software Engineer | Full Stack Developer</p>
        </div>

        <div className='grid grid-cols-2 gap-2 mb-4'>
          <div className='bg-slate-800/50 rounded-lg p-2 text-center hover:bg-slate-800 transition-colors cursor-pointer group/stat'>
            <p className='text-xs text-slate-500 font-medium uppercase tracking-wide'>Post Views</p>
            <p className='text-lg font-bold text-white group-hover/stat:text-violet-400 transition-colors'>1.2k</p>
          </div>
          <div className='bg-slate-800/50 rounded-lg p-2 text-center hover:bg-slate-800 transition-colors cursor-pointer group/stat'>
            <p className='text-xs text-slate-500 font-medium uppercase tracking-wide'>Connections</p>
            <p className='text-lg font-bold text-white group-hover/stat:text-violet-400 transition-colors'>500+</p>
          </div>
        </div>

        <div className='text-xs text-slate-500 text-center pt-2 border-t border-slate-800/50'>
          <span className='hover:text-slate-300 cursor-pointer transition-colors'>Saved items</span>
          <span className='mx-2'>•</span>
          <span className='hover:text-slate-300 cursor-pointer transition-colors'>Groups</span>
          <span className='mx-2'>•</span>
          <span className='hover:text-slate-300 cursor-pointer transition-colors'>Events</span>
        </div>
      </div>
    </div>
  );
};
