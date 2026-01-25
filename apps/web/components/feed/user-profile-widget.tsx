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
    <div className='bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden group hover:border-violet-500/30 transition-all duration-300 shadow-lg shadow-black/20'>
      {/* Cover Image Area */}
      <div className='h-28 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] opacity-30 mix-blend-overlay'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
      </div>

      <div className='px-5 pb-5 relative'>
        <div className='flex justify-between items-end -mt-10 mb-3'>
          <Avatar className='h-20 w-20 border-4 border-slate-950 shadow-xl cursor-pointer transition-transform duration-300 group-hover:scale-105 ring-2 ring-slate-800'>
            <AvatarImage src={user.avatarUrl!} alt={user.name!} />
            <AvatarFallback className='bg-slate-800 text-violet-400 text-xl font-bold'>
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Link href='/profile'>
            <Button
              size='sm'
              variant='outline'
              className='text-xs h-8 bg-slate-900/50 border-slate-700/60 text-slate-300 hover:text-white hover:border-violet-500 hover:bg-violet-500/10 backdrop-blur-sm'
            >
              View Profile
            </Button>
          </Link>
        </div>

        <div className='mb-6'>
          <h3 className='font-bold text-white text-lg leading-tight hover:text-violet-400 cursor-pointer transition-colors max-w-full truncate'>
            {user.name}
          </h3>
          <p className='text-slate-400 text-sm mt-1 line-clamp-1'>Software Engineer | Full Stack Developer</p>
        </div>

        <div className='grid grid-cols-2 gap-3 mb-5'>
          <div className='bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 text-center hover:bg-slate-800/50 hover:border-slate-600 transition-all cursor-pointer group/stat'>
            <p className='text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1'>Post Views</p>
            <p className='text-xl font-bold text-white group-hover/stat:text-violet-400 transition-colors'>1.2k</p>
          </div>
          <div className='bg-slate-800/30 border border-slate-700/30 rounded-xl p-3 text-center hover:bg-slate-800/50 hover:border-slate-600 transition-all cursor-pointer group/stat'>
            <p className='text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1'>Connections</p>
            <p className='text-xl font-bold text-white group-hover/stat:text-violet-400 transition-colors'>500+</p>
          </div>
        </div>

        <div className='text-xs text-slate-500 text-center pt-4 border-t border-slate-800/50 font-medium'>
          <span className='hover:text-violet-400 cursor-pointer transition-colors'>Saved items</span>
          <span className='mx-2 text-slate-700'>•</span>
          <span className='hover:text-violet-400 cursor-pointer transition-colors'>Groups</span>
          <span className='mx-2 text-slate-700'>•</span>
          <span className='hover:text-violet-400 cursor-pointer transition-colors'>Events</span>
        </div>
      </div>
    </div>
  );
};
